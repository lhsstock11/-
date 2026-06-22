export interface Review {
  id: string;
  user: string;
  rating: number;
  content: string;
  photo: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: string;
  ageGroup: string;
  ingredients: string[];
  price: number;
  subscriptionDiscount: number; // e.g., 50 for 50% discount
  rating: number;
  reviewCount: number;
  image: string;
  features: string[];
  reviews: Review[];
}

export interface SurveyAnswer {
  gender: string;                 // 'male' | 'female' | 'other'
  ageGroup: string;               // '2040' | '3050' | 'senior' | 'all'
  lifestyles: string[];           // Selected lifestyle focuses (e.g., 'fatigue', 'skin', 'eyes', 'digestion', 'stress')
  preferredForm: string;          // 'pill' (알약) | 'powder' (가루) | 'liquid' (액상) | 'all'
  dietaryPatterns: string[];      // Eating habits (e.g., 'delivery_food', 'coffee', 'irregular', 'dieting')
}

export interface CartItem {
  id: string; // unique cart item id (product.id + isSubscription + deliveryCycle)
  product: Product;
  quantity: number;
  isSubscription: boolean;
  deliveryCycle: number; // 4 | 8 | 12 weeks
}

export interface SubscriptionSchedule {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  cost: number;
  deliveryCycle: number; // 4 | 8 | 12 weeks
  nextDeliveryDate: string;
  active: boolean;
}

export interface UserState {
  isLoggedIn: boolean;
  name: string;
  email: string;
  surveyAnswers: SurveyAnswer | null;
  subscriptions: SubscriptionSchedule[];
  role?: "admin" | "user";
}

export type ViewType = 'home' | 'survey' | 'result' | 'shop' | 'cart' | 'mypage' | 'admin';
