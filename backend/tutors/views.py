from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from .models import TutorProfile, TutorAvailability, Review
from .serializers import (
    TutorProfileSerializer, TutorProfileListSerializer,
    TutorAvailabilitySerializer, ReviewSerializer
)


class IsTutorOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user


class TutorListView(generics.ListAPIView):
    serializer_class = TutorProfileListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__first_name', 'user__last_name', 'city', 'description']
    ordering_fields = ['rating', 'price_per_hour', 'experience_years', 'created_at']
    ordering = ['-rating']

    def get_queryset(self):
        qs = TutorProfile.objects.select_related('user').all()
        
        # Subject filter
        subject = self.request.query_params.get('subject')
        if subject:
            qs = qs.filter(subjects__icontains=subject)

        # Price filters
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            qs = qs.filter(price_per_hour__gte=min_price)
        if max_price:
            qs = qs.filter(price_per_hour__lte=max_price)

        # City filter
        city = self.request.query_params.get('city')
        if city:
            qs = qs.filter(city__icontains=city)

        # Rating filter
        min_rating = self.request.query_params.get('min_rating')
        if min_rating:
            qs = qs.filter(rating__gte=min_rating)

        # Format filter
        format_type = self.request.query_params.get('format')
        if format_type:
            qs = qs.filter(Q(format=format_type) | Q(format='both'))

        # Online status
        is_online = self.request.query_params.get('is_online')
        if is_online == 'true':
            qs = qs.filter(is_online=True)

        # Verified
        is_verified = self.request.query_params.get('is_verified')
        if is_verified == 'true':
            qs = qs.filter(is_verified=True)

        return qs


class TutorDetailView(generics.RetrieveUpdateAPIView):
    queryset = TutorProfile.objects.select_related('user').prefetch_related(
        'availability', 'reviews__student'
    )
    serializer_class = TutorProfileSerializer
    permission_classes = [IsTutorOwner]


@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def my_tutor_profile(request):
    if request.method == 'GET':
        try:
            profile = request.user.tutor_profile
            serializer = TutorProfileSerializer(profile, context={'request': request})
            return Response(serializer.data)
        except TutorProfile.DoesNotExist:
            return Response({'detail': 'Профиль репетитора не найден.'}, status=404)

    elif request.method == 'POST':
        if request.user.role != 'tutor':
            return Response(
                {'error': 'Только репетиторы могут создать профиль репетитора.'},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            profile = request.user.tutor_profile
            serializer = TutorProfileSerializer(
                profile, data=request.data, partial=True, context={'request': request}
            )
        except TutorProfile.DoesNotExist:
            serializer = TutorProfileSerializer(
                data=request.data, context={'request': request}
            )

        serializer.is_valid(raise_exception=True)
        if not hasattr(request.user, 'tutor_profile'):
            serializer.save(user=request.user)
        else:
            serializer.save()
        return Response(serializer.data)


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        tutor_id = self.kwargs['tutor_id']
        return Review.objects.filter(tutor_id=tutor_id).select_related('student')

    def perform_create(self, serializer):
        tutor_id = self.kwargs['tutor_id']
        tutor = TutorProfile.objects.get(id=tutor_id)
        serializer.save(student=self.request.user, tutor=tutor)


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(student=self.request.user)


class AvailabilityListCreateView(generics.ListCreateAPIView):
    serializer_class = TutorAvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            return self.request.user.tutor_profile.availability.all()
        except TutorProfile.DoesNotExist:
            return TutorAvailability.objects.none()

    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user.tutor_profile)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_subjects(request):
    from .models import SUBJECT_CHOICES
    return Response([{'value': v, 'label': l} for v, l in SUBJECT_CHOICES])


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_cities(request):
    cities = TutorProfile.objects.exclude(city='').values_list('city', flat=True).distinct()
    return Response(list(cities))
