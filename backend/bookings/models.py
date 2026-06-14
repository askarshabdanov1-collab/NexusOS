from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает подтверждения'),
        ('confirmed', 'Подтверждено'),
        ('rejected', 'Отклонено'),
        ('completed', 'Завершено'),
        ('cancelled', 'Отменено'),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='student_bookings'
    )
    tutor = models.ForeignKey(
        'tutors.TutorProfile', on_delete=models.CASCADE,
        related_name='tutor_bookings'
    )
    subject = models.CharField(max_length=50)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_trial = models.BooleanField(default=False)
    format = models.CharField(max_length=10, choices=[
        ('online', 'Онлайн'),
        ('offline', 'Оффлайн'),
    ], default='online')
    meeting_link = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Бронирование'
        verbose_name_plural = 'Бронирования'
        ordering = ['-created_at']

    def __str__(self):
        return f"Урок: {self.student.full_name} с {self.tutor} - {self.date}"

    def clean(self):
        # Prevent double booking
        if self.date and self.start_time and self.end_time:
            overlapping = Booking.objects.filter(
                tutor=self.tutor,
                date=self.date,
                status__in=['pending', 'confirmed']
            ).exclude(pk=self.pk)

            for booking in overlapping:
                if (self.start_time < booking.end_time and
                        self.end_time > booking.start_time):
                    raise ValidationError(
                        'Репетитор уже занят в это время. '
                        'Пожалуйста, выберите другое время.'
                    )
