from django.urls import path
from . import views

urlpatterns = [
    path('', views.BookingListCreateView.as_view(), name='booking-list'),
    path('<int:pk>/', views.BookingDetailView.as_view(), name='booking-detail'),
    path('<int:pk>/status/', views.update_booking_status, name='booking-status'),
    path('tutor/<int:tutor_id>/slots/', views.tutor_availability_slots, name='tutor-slots'),
]
