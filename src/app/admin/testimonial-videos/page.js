import TestimonialVideoList from "@/app/admin/components/TestimonialVideoList";

export default function TestimonialVideosPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827", margin: 0 }}>
          Manage Testimonial Videos
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.5rem" }}>
          Create and manage testimonial videos by category
        </p>
      </div>
      <TestimonialVideoList />
    </div>
  );
}

