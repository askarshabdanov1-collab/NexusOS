"""
Seed script to populate the database with demo data.
Run: python seed.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tutormarket_api.settings')
django.setup()

from django.contrib.auth import get_user_model
from tutors.models import TutorProfile, TutorAvailability, Review
from bookings.models import Booking
from messaging.models import Conversation, Message

User = get_user_model()

print("Создание демонстрационных данных...")

# Create superuser
if not User.objects.filter(email='admin@tutormarket.kz').exists():
    admin = User.objects.create_superuser(
        email='admin@tutormarket.kz',
        username='admin',
        password='admin123',
        first_name='Администратор',
        last_name='Системы',
        role='student'
    )
    print("✓ Суперпользователь создан")

# Create demo students
students_data = [
    {'email': 'aizat@student.kz', 'first_name': 'Айзат', 'last_name': 'Бекова', 'username': 'aizat'},
    {'email': 'daniyar@student.kz', 'first_name': 'Данияр', 'last_name': 'Сейткали', 'username': 'daniyar'},
    {'email': 'malika@student.kz', 'first_name': 'Малика', 'last_name': 'Жанова', 'username': 'malika'},
]

students = []
for s in students_data:
    user, created = User.objects.get_or_create(
        email=s['email'],
        defaults={**s, 'role': 'student', 'phone': '+7 700 000 0000'}
    )
    if created:
        user.set_password('student123')
        user.save()
    students.append(user)
print(f"✓ {len(students)} студентов создано")

# Create demo tutors
tutors_data = [
    {
        'email': 'arman.tutor@tutormarket.kz',
        'first_name': 'Арман',
        'last_name': 'Сейтов',
        'username': 'arman_tutor',
        'bio': 'Опытный преподаватель математики с 10-летним стажем.',
        'profile': {
            'subjects': ['math', 'physics'],
            'price_per_hour': 8000,
            'experience_years': 10,
            'education': 'КазНУ им. аль-Фараби, физико-математический факультет',
            'education_level': 'master',
            'university': 'КазНУ им. аль-Фараби',
            'format': 'both',
            'location': 'Алматы, Бостандыкский район',
            'city': 'Алматы',
            'description': 'Готовлю к ЕНТ, олимпиадам и поступлению в вузы. Индивидуальный подход к каждому ученику. 95% учеников поступили в топ-вузы.',
            'is_online': True,
            'is_verified': True,
            'total_students': 150,
            'total_lessons': 2340,
            'languages': ['Русский', 'Казахский'],
            'trial_lesson_available': True,
            'trial_lesson_price': 3000,
        }
    },
    {
        'email': 'laura.english@tutormarket.kz',
        'first_name': 'Лаура',
        'last_name': 'Нурлан',
        'username': 'laura_english',
        'bio': 'Сертифицированный преподаватель английского языка, CELTA.',
        'profile': {
            'subjects': ['english'],
            'price_per_hour': 10000,
            'experience_years': 8,
            'education': 'КИМЭП, факультет иностранных языков',
            'education_level': 'master',
            'university': 'КИМЭП',
            'format': 'online',
            'location': 'Алматы',
            'city': 'Алматы',
            'description': 'IELTS, TOEFL, деловой английский. Сертификат CELTA Cambridge. Студенты достигают результата за 3 месяца.',
            'is_online': True,
            'is_verified': True,
            'total_students': 200,
            'total_lessons': 3100,
            'languages': ['Русский', 'Английский', 'Казахский'],
            'trial_lesson_available': True,
            'trial_lesson_price': 0,
        }
    },
    {
        'email': 'bekzat.chemistry@tutormarket.kz',
        'first_name': 'Бекзат',
        'last_name': 'Омаров',
        'username': 'bekzat_chem',
        'bio': 'Кандидат химических наук, доцент КазНТУ.',
        'profile': {
            'subjects': ['chemistry', 'biology'],
            'price_per_hour': 9000,
            'experience_years': 15,
            'education': 'КазНТУ, химический факультет',
            'education_level': 'phd',
            'university': 'КазНТУ',
            'format': 'both',
            'location': 'Алматы, Медеуский район',
            'city': 'Алматы',
            'description': 'Подготовка к ЕНТ по химии и биологии. Авторская методика. Гарантирую результат от 90 баллов.',
            'is_online': False,
            'is_verified': True,
            'total_students': 320,
            'total_lessons': 5600,
            'languages': ['Русский', 'Казахский'],
            'trial_lesson_available': False,
            'trial_lesson_price': 0,
        }
    },
    {
        'email': 'diana.programming@tutormarket.kz',
        'first_name': 'Диана',
        'last_name': 'Касымова',
        'username': 'diana_code',
        'bio': 'Full-stack разработчик, 6 лет в индустрии.',
        'profile': {
            'subjects': ['programming', 'informatics'],
            'price_per_hour': 12000,
            'experience_years': 6,
            'education': 'IITU, факультет информационных технологий',
            'education_level': 'bachelor',
            'university': 'IITU',
            'format': 'online',
            'location': 'Астана',
            'city': 'Астана',
            'description': 'Python, JavaScript, React, Django. Подготовка к собеседованиям в IT-компании. Портфолио проекты от первого урока.',
            'is_online': True,
            'is_verified': True,
            'total_students': 85,
            'total_lessons': 940,
            'languages': ['Русский', 'Английский'],
            'trial_lesson_available': True,
            'trial_lesson_price': 5000,
        }
    },
    {
        'email': 'yerlan.history@tutormarket.kz',
        'first_name': 'Ерлан',
        'last_name': 'Бейсенов',
        'username': 'yerlan_history',
        'bio': 'Историк, преподаватель с 20-летним стажем.',
        'profile': {
            'subjects': ['history', 'geography', 'kazakh'],
            'price_per_hour': 6000,
            'experience_years': 20,
            'education': 'КазНПУ им. Абая, исторический факультет',
            'education_level': 'master',
            'university': 'КазНПУ им. Абая',
            'format': 'both',
            'location': 'Алматы, Алатауский район',
            'city': 'Алматы',
            'description': 'История Казахстана, всемирная история, ЕНТ. Авторские конспекты и тесты. Опыт работы учителем в школе и репетитором.',
            'is_online': True,
            'is_verified': False,
            'total_students': 240,
            'total_lessons': 4200,
            'languages': ['Русский', 'Казахский'],
            'trial_lesson_available': True,
            'trial_lesson_price': 2000,
        }
    },
    {
        'email': 'ainur.music@tutormarket.kz',
        'first_name': 'Айнур',
        'last_name': 'Сабит',
        'username': 'ainur_music',
        'bio': 'Пианистка, преподаватель музыки.',
        'profile': {
            'subjects': ['music'],
            'price_per_hour': 7500,
            'experience_years': 12,
            'education': 'КазНАИ им. Т. Жургенова, фортепиано',
            'education_level': 'master',
            'university': 'КазНАИ им. Т. Жургенова',
            'format': 'offline',
            'location': 'Алматы, Бостандыкский район',
            'city': 'Алматы',
            'description': 'Обучение игре на фортепиано с нуля. Дети от 5 лет и взрослые. Подготовка к конкурсам и поступлению в музыкальные школы.',
            'is_online': False,
            'is_verified': True,
            'total_students': 60,
            'total_lessons': 1800,
            'languages': ['Русский', 'Казахский'],
            'trial_lesson_available': True,
            'trial_lesson_price': 3500,
        }
    },
]

tutor_users = []
for t in tutors_data:
    profile_data = t.pop('profile')
    user, created = User.objects.get_or_create(
        email=t['email'],
        defaults={**t, 'role': 'tutor', 'phone': '+7 701 000 0000'}
    )
    if created:
        user.set_password('tutor123')
        user.save()

    tutor_profile, _ = TutorProfile.objects.get_or_create(
        user=user,
        defaults=profile_data
    )
    tutor_users.append((user, tutor_profile))

    # Add availability
    if not tutor_profile.availability.exists():
        for day in [0, 1, 2, 3, 4]:  # Mon-Fri
            TutorAvailability.objects.create(
                tutor=tutor_profile,
                day_of_week=day,
                start_time='09:00',
                end_time='18:00'
            )

print(f"✓ {len(tutor_users)} репетиторов создано")

# Add reviews
reviews_data = [
    (tutor_users[0][1], students[0], 5, 'Отличный репетитор! Помог сдать ЕНТ на 96 баллов по математике. Очень терпеливый и объясняет всё понятно.'),
    (tutor_users[0][1], students[1], 5, 'Занимаемся уже 6 месяцев. Прогресс огромный. Рекомендую всем!'),
    (tutor_users[0][1], students[2], 4, 'Хороший преподаватель, знает предмет отлично. Иногда урок идёт чуть быстрее чем хотелось бы.'),
    (tutor_users[1][1], students[0], 5, 'Лаура — лучший учитель английского! За 3 месяца я сдала IELTS на 7.0. Невероятный результат!'),
    (tutor_users[1][1], students[2], 5, 'Профессионал своего дела. Уроки всегда интересные и насыщенные.'),
    (tutor_users[2][1], students[1], 5, 'Бекзат Омарович — настоящий учёный. Объясняет химию так, что всё становится понятным.'),
    (tutor_users[3][1], students[0], 5, 'Диана помогла мне освоить Python и найти работу в IT. Лучшая инвестиция!'),
    (tutor_users[4][1], students[2], 4, 'Хорошо знает предмет, много материала. Иногда слишком много информации за раз.'),
]

for tutor_profile, student, rating, comment in reviews_data:
    Review.objects.get_or_create(
        tutor=tutor_profile,
        student=student,
        defaults={'rating': rating, 'comment': comment}
    )

# Update ratings
for _, tutor_profile in tutor_users:
    tutor_profile.update_rating()

print("✓ Отзывы добавлены")

# Create sample bookings
import datetime
today = datetime.date.today()

if students and tutor_users:
    Booking.objects.get_or_create(
        student=students[0],
        tutor=tutor_users[0][1],
        date=today + datetime.timedelta(days=2),
        start_time='10:00',
        defaults={
            'end_time': '11:00',
            'subject': 'math',
            'status': 'confirmed',
            'price': 8000,
            'format': 'online',
            'message': 'Хочу разобрать тему "Производные"'
        }
    )
    Booking.objects.get_or_create(
        student=students[0],
        tutor=tutor_users[1][1],
        date=today + datetime.timedelta(days=3),
        start_time='14:00',
        defaults={
            'end_time': '15:00',
            'subject': 'english',
            'status': 'pending',
            'price': 10000,
            'format': 'online',
            'message': 'Подготовка к IELTS Speaking'
        }
    )

print("✓ Бронирования созданы")

# Create conversations
if students and tutor_users:
    conv, created = Conversation.objects.get_or_create(id=1)
    if created or not conv.participants.exists():
        conv.participants.set([students[0], tutor_users[0][0]])
    
    if not conv.messages.exists():
        Message.objects.create(
            conversation=conv,
            sender=students[0],
            content='Здравствуйте! Я хотел бы записаться на урок по математике.'
        )
        Message.objects.create(
            conversation=conv,
            sender=tutor_users[0][0],
            content='Добрый день! Конечно, буду рад помочь. Какие темы вас интересуют?'
        )
        Message.objects.create(
            conversation=conv,
            sender=students[0],
            content='Мне нужна помощь с производными и интегралами. Готовлюсь к ЕНТ.'
        )
        Message.objects.create(
            conversation=conv,
            sender=tutor_users[0][0],
            content='Отлично! Давайте начнём со следующей недели. Удобно в понедельник в 10:00?'
        )

print("✓ Сообщения созданы")

print("\n🎉 Демонстрационные данные успешно созданы!")
print("\n📋 Аккаунты для тестирования:")
print("  Студент:   aizat@student.kz / student123")
print("  Репетитор: arman.tutor@tutormarket.kz / tutor123")
print("  Админ:     admin@tutormarket.kz / admin123")
