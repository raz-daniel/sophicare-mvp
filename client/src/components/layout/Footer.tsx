export const Footer = () => {
  return (
    <footer className="bg-metal py-4">
      <div className="container mx-auto px-4">
        <p className="text-center text-text/60">
          © {new Date().getFullYear()} SophiCare. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
