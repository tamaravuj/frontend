function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>&copy; {currentYear} FreshFit sokovi. Sva prava zadrzana.</p>
    </footer>
  );
}

export default Footer;
