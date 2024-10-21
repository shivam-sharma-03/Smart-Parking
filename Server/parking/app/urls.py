# app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('ir-data/', views.ir_data, name='ir-data'),
]
