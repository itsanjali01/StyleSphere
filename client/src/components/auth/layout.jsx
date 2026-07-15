import { Outlet } from "react-router-dom";
import logo from "@/assets/Logo.png";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex items-center justify-center bg-black w-1/2 px-12">
        <div className="max-w-md space-y-6 text-center text-primary-foreground">
          <img src={logo} alt="Ecommerce Logo" className="mx-auto h-25 w-auto" />
        <div className="space-y-4">
  <div className="space-y-6">
  <h1
    className="text-3xl font-bold italic tracking-[0.12em]"
    style={{
      fontFamily: "'Cinzel', serif",
      color: "#B5B5B5",
    }}
  >
    Welcome to Style Sphere
  </h1>

  <h2
    className="text-2xl italic tracking-[0.08em]"
    style={{
      fontFamily: "'Cinzel', serif",
      color: "#B5B5B5",
    }}
  >
   Dress Beyond Trends
  </h2>
</div>
</div>
          
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
