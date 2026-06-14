from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['student', 'tutor', 'subject', 'date', 'start_time', 'status', 'price']
    list_filter = ['status', 'date', 'format']
    search_fields = ['student__first_name', 'student__last_name',
                     'tutor__user__first_name', 'tutor__user__last_name']
    readonly_fields = ['created_at', 'updated_at']
