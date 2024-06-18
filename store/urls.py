# from django.urls import path
# # from . import views
# from .views import ProductList, ProductDetail, CartList, CartDetail, StockDetail, CategoryList, RegionList

# urlpatterns = [
#     path('products/', ProductList.as_view(), name='product-list'),
#     path('products/<int:pk>/', ProductDetail.as_view(), name='product-detail'),
#     path('cart/', CartList.as_view(), name='cart-list'),
#     path('cart/<int:pk>/', CartDetail.as_view(), name='cart-detail'),
#     path('stock/<int:pk>/', StockDetail.as_view(), name='stock-detail'),
#     path('categories/', CategoryList.as_view(), name='category-list'),
#     path('regions/', RegionList.as_view(), name='region-list'),
# ]

from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.product_list, name='product_list'),
    path('products/<int:pk>/', views.product_detail, name='product_detail'),
    path('cart/', views.cart_list, name='cart_list'),
    # path('cart/add', views.add_to_cart, name='add_to_cart'),
    path('cart/<int:pk>/', views.cart_detail, name='cart_detail'),
    path('stock/<int:pk>/', views.stock_detail, name='stock_detail'),
    path('categories/', views.category_list, name='category_list'),
    path('regions/', views.region_list, name='region_list'),
]
