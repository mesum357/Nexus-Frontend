import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Store from "./pages/Store";
import CreateShop from "./pages/ShopWizard";
import Shop from "./pages/Shop";
import EditShop from "./pages/EditShop";
import Education from "./pages/Education";
import Hospital from "./pages/Hospital";
import Feed from "./pages/Feed";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";
import AuthSlider from "./pages/AuthSlider";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Education Module Pages
import InstituteDetail from "./pages/education/InstituteDetail";
import CreateInstitute from "./pages/education/CreateInstitute";
import EditInstitute from "./pages/education/EditInstitute";
import StudentDashboard from "./pages/education/StudentDashboard";
import InstituteDashboard from "./pages/education/InstituteDashboard";
import InstituteStudentDashboard from "./pages/education/InstituteStudentDashboard";
import Courses from "./pages/education/Courses";
import ApplyNow from "./pages/education/ApplyNow";
import MyApplications from "./pages/education/MyApplications";

// Feed Module Pages
import PostDetail from "./pages/feed/PostDetail";
import UserProfile from "./pages/feed/UserProfile";
import Profile from "./pages/feed/Profile";
import CreatePost from "./pages/feed/CreatePost";
import Friends from "./pages/feed/Friends";
import Followers from "./pages/feed/Followers";
import Notifications from "./pages/feed/Notifications";

// Marketplace Module Pages
import ProductDetail from "./pages/marketplace/ProductDetail";
import CreateProduct from "./pages/marketplace/CreateProduct";
import EditProduct from "./pages/marketplace/EditProduct";
import UserDashboard from "./pages/marketplace/UserDashboard";



// Store Module Pages
// Hospital Module Pages
import HospitalDetail from "./pages/hospital/HospitalDetail";
import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import Technicalities from "./pages/hospital/Technicalities";
import CreateHospital from "./pages/hospital/CreateHospital";
import EditHospital from "./pages/hospital/EditHospital";
import PatientDashboard from "./pages/hospital/PatientDashboard";
import HospitalApplyNow from "./pages/hospital/ApplyNow";
import HospitalPatientDashboard from "./pages/hospital/HospitalPatientDashboard";
import PatientRegistration from "./pages/hospital/PatientRegistration";
import PatientHospitalDashboard from "./pages/hospital/PatientHospitalDashboard";
import ShopDetail from "./pages/store/ShopDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/store" element={<Store />} />
          <Route path="/create-shop" element={<CreateShop />} />
          <Route path="/shop/:shopId" element={<Shop />} />
          <Route path="/shop/:shopId/edit" element={<EditShop />} />
          <Route path="/education" element={<Education />} />
          <Route path="/education/institute/:id" element={<InstituteDetail />} />
          <Route path="/education/institute/:id/dashboard" element={<InstituteDashboard />} />
          <Route path="/education/institute/:id/student-dashboard" element={<InstituteStudentDashboard />} />
          <Route path="/education/institute/:id/courses" element={<Courses />} />
          <Route path="/education/institute/:id/apply" element={<ApplyNow />} />
          <Route path="/education/create" element={<CreateInstitute />} />
          <Route path="/education/edit/:id" element={<EditInstitute />} />
          <Route path="/education/dashboard" element={<StudentDashboard />} />
          <Route path="/education/institute-dashboard" element={<InstituteDashboard />} />
          <Route path="/education/applications" element={<MyApplications />} />
          
          {/* Hospital Module */}
          <Route path="/hospital" element={<Hospital />} />
          <Route path="/hospital/hospital/:id" element={<HospitalDetail />} />
          <Route path="/hospital/hospital/:id/dashboard" element={<HospitalDashboard />} />
          <Route path="/hospital/hospital/:id/technicalities" element={<Technicalities />} />
          <Route path="/hospital/hospital/:id/apply" element={<PatientRegistration />} />
          <Route path="/hospital/hospital/:id/patient-dashboard" element={<PatientHospitalDashboard />} />
          <Route path="/hospital/create" element={<CreateHospital />} />
          <Route path="/hospital/edit/:id" element={<EditHospital />} />
          <Route path="/hospital/dashboard" element={<PatientDashboard />} />
          <Route path="/hospital/:id/apply" element={<HospitalApplyNow />} />
                     <Route path="/hospital/:id/patient-dashboard" element={<PatientHospitalDashboard />} />
          
          <Route path="/feed" element={<Feed />} />
          <Route path="/feed/post/:id" element={<PostDetail />} />
          <Route path="/feed/profile/:username" element={<UserProfile />} />
        <Route path="/feed/profile" element={<Profile />} />
          <Route path="/feed/create" element={<CreatePost />} />
          <Route path="/feed/friends" element={<Friends />} />
          <Route path="/feed/followers" element={<Followers />} />
          <Route path="/feed/notifications" element={<Notifications />} />
          
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/product/:productId" element={<ProductDetail />} />
          <Route path="/marketplace/create" element={<CreateProduct />} />
          <Route path="/marketplace/edit/:productId" element={<EditProduct />} />
          <Route path="/marketplace/dashboard" element={<UserDashboard />} />
          

          
          <Route path="/store/shop/:shopId" element={<ShopDetail />} />

          {/* ✅ New sliding auth route */}
          <Route path="/auth" element={<AuthSlider />} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
