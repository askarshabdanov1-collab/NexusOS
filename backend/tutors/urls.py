from django.urls import path
from . import views

urlpatterns = [
    path('', views.TutorListView.as_view(), name='tutor-list'),
    path('<int:pk>/', views.TutorDetailView.as_view(), name='tutor-detail'),
    path('my-profile/', views.my_tutor_profile, name='my-tutor-profile'),
    path('<int:tutor_id>/reviews/', views.ReviewListCreateView.as_view(), name='tutor-reviews'),
    path('reviews/<int:pk>/', views.ReviewDetailView.as_view(), name='review-detail'),
    path('my-availability/', views.AvailabilityListCreateView.as_view(), name='my-availability'),
    path('subjects/', views.get_subjects, name='subjects'),
    path('cities/', views.get_cities, name='cities'),
]
