
import { Product } from './types';

export const BRAND_NAME = "Rượu Ngâm Thanh Hà";
export const COLORS = {
  bg: "#FAF9F6",
  panel: "#FFFFFF",
  brand: "#B48C48",
  brandLight: "#D4B483",
  text: "#2C241E",
  muted: "#7C746E",
  danger: "#D9534F",
  success: "#3FB984"
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "sam-ngoc-linh",
    name: "Rượu Sâm Ngọc Linh Thượng Hạng",
    category: "Rượu Sâm",
    price: 1590000,
    originalPrice: 1790000,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c76cf?q=80&auto=format&fit=crop&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c76cf?q=80&auto=format&fit=crop&w=1200",
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1200"
    ],
    description: "Sâm Ngọc Linh tuyển chọn từ vùng núi cao, kết hợp rượu nếp cái hoa vàng 40 độ, mang lại vị ngọt hậu và bồi bổ sức khỏe tuyệt đối. Quy trình ngâm ủ kéo dài giúp loại bỏ hoàn toàn tạp chất, giữ lại tinh túy dược liệu.",
    volume: "1 lít",
    strength: "40%",
    rating: 5,
    reviews: 124,
    featured: true,
    sku: "SNL-TH-01",
    tags: ["Cao Cấp", "Bồi Bổ", "Bách Nhật", "Sâm Quý", "Hiếm"],
    flavorProfile: {
      strength: 85,
      sweetness: 40,
      healthBenefit: 95,
      aroma: 90,
      smoothness: 80
    }
  },
  {
    id: "ba-kich-tim",
    name: "Rượu Ba Kích Tím Quảng Ninh",
    category: "Rượu Ba Kích",
    price: 590000,
    originalPrice: 690000,
    image: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&auto=format&fit=crop&w=1200",
    gallery: ["https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&auto=format&fit=crop&w=1200"],
    description: "Ba kích tím Quảng Ninh ngâm đủ 90 ngày, màu tím đẹp mắt, vị êm, bồi bổ thận tráng dương. Sản phẩm được lọc qua hệ thống phân tầng hiện đại để đảm bảo độ trong suốt tuyệt mỹ.",
    volume: "1 lít",
    strength: "38%",
    rating: 5,
    reviews: 210,
    featured: true,
    sku: "BKT-03",
    tags: ["Tăng Cường", "Mạnh Gân Cốt", "Quảng Ninh", "Tự Nhiên"],
    flavorProfile: {
      strength: 75,
      sweetness: 30,
      healthBenefit: 85,
      aroma: 70,
      smoothness: 90
    }
  },
  {
    id: "dong-trung",
    name: "Rượu Đông Trùng Hạ Thảo",
    category: "Rượu Đông Trùng",
    price: 980000,
    originalPrice: 1090000,
    image: "https://images.unsplash.com/photo-1580961771157-59f207cf6a75?q=80&auto=format&fit=crop&w=1200",
    gallery: ["https://images.unsplash.com/photo-1580961771157-59f207cf6a75?q=80&auto=format&fit=crop&w=1200"],
    description: "Hậu vị ngọt thanh, dược tính cao, là món quà biếu sang trọng và ý nghĩa. Rượu có màu vàng hổ phách đặc trưng của đông trùng hạ thảo ký chủ nhộng tằm.",
    volume: "1 lít",
    strength: "35%",
    rating: 4.8,
    reviews: 56,
    featured: true,
    sku: "DTHT-04",
    tags: ["Quà Biếu", "Cao Cấp", "Bồi Bổ", "Đề Kháng"],
    flavorProfile: {
      strength: 65,
      sweetness: 60,
      healthBenefit: 90,
      aroma: 85,
      smoothness: 95
    }
  },
  {
    id: "sam-cau",
    name: "Rượu Sâm Cau Rừng Tây Bắc",
    category: "Rượu Sâm",
    price: 450000,
    image: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&auto=format&fit=crop&w=1200",
    gallery: ["https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&auto=format&fit=crop&w=1200"],
    description: "Sâm cau rừng nguyên củ ngâm hạ thổ, hỗ trợ tăng cường sinh lực và bồi bổ gân cốt hiệu quả.",
    volume: "1 lít",
    strength: "42%",
    rating: 4.7,
    reviews: 89,
    sku: "SCR-05",
    tags: ["Sinh Lực", "Tây Bắc", "Dân Dã"],
    flavorProfile: {
      strength: 80,
      sweetness: 20,
      healthBenefit: 80,
      aroma: 65,
      smoothness: 70
    }
  },
  {
    id: "tao-meo",
    name: "Rượu Táo Mèo Yên Bái",
    category: "Rượu Trái Cây",
    price: 280000,
    image: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&auto=format&fit=crop&w=1200",
    gallery: ["https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&auto=format&fit=crop&w=1200"],
    description: "Hương vị núi rừng Yên Bái, vị chua chát nhẹ đầu lưỡi, hậu vị ngọt, kích thích tiêu hóa. Sản phẩm khai thác từ quả táo mèo rừng tự nhiên.",
    volume: "1 lít",
    strength: "28%",
    rating: 4.6,
    reviews: 78,
    sku: "TM-06",
    tags: ["Tiêu Hóa", "Kích Vị"],
    flavorProfile: {
      strength: 50,
      sweetness: 75,
      healthBenefit: 60,
      aroma: 80,
      smoothness: 85
    }
  }
];
