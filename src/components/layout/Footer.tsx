import { Container } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="bg-light mt-auto py-3">
      <Container>
        <p className="text-center mb-0">
          © {new Date().getFullYear()} FormFlow Dynamics. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
