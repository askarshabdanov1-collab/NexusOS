from rest_framework import serializers
from .models import TutorProfile, TutorAvailability, Review
from users.serializers import UserSerializer


class TutorAvailabilitySerializer(serializers.ModelSerializer):
    day_name = serializers.SerializerMethodField()

    class Meta:
        model = TutorAvailability
        fields = ['id', 'day_of_week', 'day_name', 'start_time', 'end_time']

    def get_day_name(self, obj):
        return obj.get_day_of_week_display()


class ReviewSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'tutor', 'student', 'student_name', 'student_avatar',
                  'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'student', 'created_at']

    def get_student_name(self, obj):
        return obj.student.full_name

    def get_student_avatar(self, obj):
        request = self.context.get('request')
        if obj.student.avatar and hasattr(obj.student.avatar, 'url'):
            if request:
                return request.build_absolute_uri(obj.student.avatar.url)
            return obj.student.avatar.url
        return None

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)


class TutorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    availability = TutorAvailabilitySerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    subjects_display = serializers.SerializerMethodField()
    format_display = serializers.SerializerMethodField()

    class Meta:
        model = TutorProfile
        fields = [
            'id', 'user', 'subjects', 'subjects_display', 'price_per_hour',
            'price_currency', 'experience_years', 'education', 'education_level',
            'university', 'format', 'format_display', 'location', 'city',
            'description', 'video_intro_url', 'is_online', 'is_verified',
            'rating', 'total_reviews', 'total_students', 'total_lessons',
            'languages', 'trial_lesson_available', 'trial_lesson_price',
            'availability', 'reviews', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'rating', 'total_reviews', 'created_at', 'updated_at']

    def get_subjects_display(self, obj):
        from .models import SUBJECT_CHOICES
        subject_map = dict(SUBJECT_CHOICES)
        return [subject_map.get(s, s) for s in obj.subjects]

    def get_format_display(self, obj):
        return obj.get_format_display()


class TutorProfileListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    user_first_name = serializers.CharField(source='user.first_name')
    user_last_name = serializers.CharField(source='user.last_name')
    user_email = serializers.CharField(source='user.email')
    avatar_url = serializers.SerializerMethodField()
    subjects_display = serializers.SerializerMethodField()
    format_display = serializers.SerializerMethodField()

    class Meta:
        model = TutorProfile
        fields = [
            'id', 'user_first_name', 'user_last_name', 'user_email', 'avatar_url',
            'subjects', 'subjects_display', 'price_per_hour', 'price_currency',
            'experience_years', 'format', 'format_display', 'city',
            'is_online', 'is_verified', 'rating', 'total_reviews',
            'trial_lesson_available', 'trial_lesson_price', 'description'
        ]

    def get_avatar_url(self, obj):
        request = self.context.get('request')
        if obj.user.avatar and hasattr(obj.user.avatar, 'url'):
            if request:
                return request.build_absolute_uri(obj.user.avatar.url)
            return obj.user.avatar.url
        return None

    def get_subjects_display(self, obj):
        from .models import SUBJECT_CHOICES
        subject_map = dict(SUBJECT_CHOICES)
        return [subject_map.get(s, s) for s in obj.subjects]

    def get_format_display(self, obj):
        return obj.get_format_display()
