from django.contrib import admin
from .models import TutorProfile, TutorAvailability, Review


@admin.register(TutorProfile)
class TutorProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'city', 'price_per_hour', 'rating', 'total_reviews',
                    'is_online', 'is_verified', 'created_at']
    list_filter = ['is_verified', 'is_online', 'format', 'city']
    search_fields = ['user__first_name', 'user__last_name', 'city']
    readonly_fields = ['rating', 'total_reviews', 'created_at', 'updated_at']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['tutor', 'student', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']


@admin.register(TutorAvailability)
class TutorAvailabilityAdmin(admin.ModelAdmin):
    list_display = ['tutor', 'day_of_week', 'start_time', 'end_time']
