from django.urls import path
from .views import power_data_view, export_pdf_view

urlpatterns = [
    path('power-data/', power_data_view, name='power-data'),
    path('export-pdf/', export_pdf_view, name='export-pdf'),
]
