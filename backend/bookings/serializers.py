from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    tutor_name = serializers.SerializerMethodField()
    tutor_avatar = serializers.SerializerMethodField()
    student_avatar = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    subject_display = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'student', 'tutor', 'student_name', 'tutor_name',
            'student_avatar', 'tutor_avatar',
            'subject', 'subject_display', 'date', 'start_time', 'end_time',
            'status', 'status_display', 'message', 'price', 'is_trial',
            'format', 'meeting_link', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'student', 'status', 'created_at', 'updated_at']

    def get_student_name(self, obj):
        return obj.student.full_name

    def get_tutor_name(self, obj):
        return obj.tutor.user.full_name

    def get_tutor_avatar(self, obj):
        request = self.context.get('request')
        if obj.tutor.user.avatar and hasattr(obj.tutor.user.avatar, 'url'):
            if request:
                return request.build_absolute_uri(obj.tutor.user.avatar.url)
            return obj.tutor.user.avatar.url
        return None

    def get_student_avatar(self, obj):
        request = self.context.get('request')
        if obj.student.avatar and hasattr(obj.student.avatar, 'url'):
            if request:
                return request.build_absolute_uri(obj.student.avatar.url)
            return obj.student.avatar.url
        return None

    def get_status_display(self, obj):
        return obj.get_status_display()

    def get_subject_display(self, obj):
        from tutors.models import SUBJECT_CHOICES
        return dict(SUBJECT_CHOICES).get(obj.subject, obj.subject)

    def validate(self, data):
        instance = Booking(**data)
        instance.student = self.context['request'].user
        instance.clean()
        return data

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        # Set price from tutor profile
        tutor = validated_data.get('tutor')
        if tutor and 'price' not in validated_data:
            if validated_data.get('is_trial') and tutor.trial_lesson_available:
                validated_data['price'] = tutor.trial_lesson_price
            else:
                validated_data['price'] = tutor.price_per_hour
        return super().create(validated_data)
