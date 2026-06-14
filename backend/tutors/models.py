from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


SUBJECT_CHOICES = [
    ('math', 'Математика'),
    ('physics', 'Физика'),
    ('chemistry', 'Химия'),
    ('biology', 'Биология'),
    ('russian', 'Русский язык'),
    ('english', 'Английский язык'),
    ('german', 'Немецкий язык'),
    ('french', 'Французский язык'),
    ('history', 'История'),
    ('geography', 'География'),
    ('literature', 'Литература'),
    ('informatics', 'Информатика'),
    ('programming', 'Программирование'),
    ('music', 'Музыка'),
    ('art', 'Рисование'),
    ('economics', 'Экономика'),
    ('philosophy', 'Философия'),
    ('psychology', 'Психология'),
    ('kazakh', 'Казахский язык'),
    ('other', 'Другое'),
]

FORMAT_CHOICES = [
    ('online', 'Онлайн'),
    ('offline', 'Оффлайн'),
    ('both', 'Онлайн и оффлайн'),
]

EDUCATION_LEVEL_CHOICES = [
    ('bachelor', 'Бакалавр'),
    ('master', 'Магистр'),
    ('phd', 'Доктор наук'),
    ('student', 'Студент'),
    ('other', 'Другое'),
]


class TutorProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tutor_profile'
    )
    subjects = models.JSONField(default=list)
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    price_currency = models.CharField(max_length=10, default='KZT')
    experience_years = models.PositiveIntegerField(default=0)
    education = models.TextField(blank=True)
    education_level = models.CharField(
        max_length=20, choices=EDUCATION_LEVEL_CHOICES, default='bachelor'
    )
    university = models.CharField(max_length=200, blank=True)
    format = models.CharField(max_length=10, choices=FORMAT_CHOICES, default='online')
    location = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    video_intro_url = models.URLField(blank=True)
    is_online = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_reviews = models.PositiveIntegerField(default=0)
    total_students = models.PositiveIntegerField(default=0)
    total_lessons = models.PositiveIntegerField(default=0)
    languages = models.JSONField(default=list)
    trial_lesson_available = models.BooleanField(default=False)
    trial_lesson_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Профиль репетитора'
        verbose_name_plural = 'Профили репетиторов'

    def __str__(self):
        return f"Репетитор: {self.user.full_name}"

    def update_rating(self):
        from django.db.models import Avg
        avg = self.reviews.aggregate(Avg('rating'))['rating__avg']
        self.rating = avg or 0
        self.total_reviews = self.reviews.count()
        self.save(update_fields=['rating', 'total_reviews'])


class TutorAvailability(models.Model):
    DAY_CHOICES = [
        (0, 'Понедельник'),
        (1, 'Вторник'),
        (2, 'Среда'),
        (3, 'Четверг'),
        (4, 'Пятница'),
        (5, 'Суббота'),
        (6, 'Воскресенье'),
    ]

    tutor = models.ForeignKey(
        TutorProfile, on_delete=models.CASCADE, related_name='availability'
    )
    day_of_week = models.IntegerField(choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        verbose_name = 'Доступность репетитора'
        verbose_name_plural = 'Расписание репетиторов'
        unique_together = ['tutor', 'day_of_week', 'start_time']

    def __str__(self):
        return f"{self.tutor} - {self.get_day_of_week_display()}"


class Review(models.Model):
    tutor = models.ForeignKey(
        TutorProfile, on_delete=models.CASCADE, related_name='reviews'
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='given_reviews'
    )
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        unique_together = ['tutor', 'student']

    def __str__(self):
        return f"Отзыв от {self.student.full_name} для {self.tutor}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.tutor.update_rating()

    def delete(self, *args, **kwargs):
        tutor = self.tutor
        super().delete(*args, **kwargs)
        tutor.update_rating()
