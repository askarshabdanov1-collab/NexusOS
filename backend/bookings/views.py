from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from .models import Booking
from .serializers import BookingSerializer


class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'tutor':
            try:
                return Booking.objects.filter(
                    tutor=user.tutor_profile
                ).select_related('student', 'tutor__user')
            except Exception:
                return Booking.objects.none()
        else:
            return Booking.objects.filter(
                student=user
            ).select_related('student', 'tutor__user')


class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Booking.objects.filter(
            Q(student=user) | Q(tutor__user=user)
        ).select_related('student', 'tutor__user')

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        new_status = request.data.get('status')

        # Only tutor can confirm/reject
        if new_status in ['confirmed', 'rejected']:
            if user.role != 'tutor' or instance.tutor.user != user:
                return Response(
                    {'error': 'Только репетитор может подтверждать или отклонять уроки.'},
                    status=status.HTTP_403_FORBIDDEN
                )

        # Student can cancel
        if new_status == 'cancelled':
            if instance.student != user:
                return Response(
                    {'error': 'Только студент может отменить бронирование.'},
                    status=status.HTTP_403_FORBIDDEN
                )

        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_booking_status(request, pk):
    try:
        booking = Booking.objects.get(pk=pk)
    except Booking.DoesNotExist:
        return Response({'error': 'Бронирование не найдено.'}, status=404)

    user = request.user
    new_status = request.data.get('status')

    # Permission check
    if new_status in ['confirmed', 'rejected']:
        if user.role != 'tutor' or booking.tutor.user != user:
            return Response({'error': 'Нет прав.'}, status=403)
    elif new_status == 'cancelled':
        if booking.student != user:
            return Response({'error': 'Нет прав.'}, status=403)
    elif new_status == 'completed':
        if user.role != 'tutor' or booking.tutor.user != user:
            return Response({'error': 'Нет прав.'}, status=403)

    booking.status = new_status
    if new_status == 'confirmed' and request.data.get('meeting_link'):
        booking.meeting_link = request.data['meeting_link']
    booking.save()

    # Update tutor stats on completion
    if new_status == 'completed':
        tutor = booking.tutor
        tutor.total_lessons += 1
        tutor.save(update_fields=['total_lessons'])

    return Response(BookingSerializer(booking, context={'request': request}).data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def tutor_availability_slots(request, tutor_id):
    """Get available time slots for a tutor on a specific date"""
    from tutors.models import TutorProfile
    date = request.query_params.get('date')
    
    try:
        tutor = TutorProfile.objects.get(id=tutor_id)
    except TutorProfile.DoesNotExist:
        return Response({'error': 'Репетитор не найден.'}, status=404)

    # Get existing bookings
    booked_slots = Booking.objects.filter(
        tutor=tutor,
        date=date,
        status__in=['pending', 'confirmed']
    ).values('start_time', 'end_time')

    # Get tutor availability for that day
    import datetime
    if date:
        date_obj = datetime.datetime.strptime(date, '%Y-%m-%d').date()
        day_of_week = date_obj.weekday()
        availability = tutor.availability.filter(day_of_week=day_of_week)
    else:
        availability = tutor.availability.all()

    return Response({
        'availability': [
            {'start': a.start_time, 'end': a.end_time, 'day': a.day_of_week}
            for a in availability
        ],
        'booked': list(booked_slots)
    })
