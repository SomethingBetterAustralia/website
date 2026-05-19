export function SignupCTA() {
  return (
    <section className="sb-cta">
      <h3 className="sb-cta__heading">
        <strong>Sign up to help us build Something Better.</strong>
      </h3>
      <p>Under section 126 of the Electoral Act, to turn this into a new Party we need:</p>
      <ul className="sb-cta__bullets">
        <li>
          1,500 members <u>OR</u>
        </li>
        <li>one MP come on board.</li>
      </ul>
      <p className="sb-cta__disclaimer">
        <span className="sb-cta__disclaimer-mark">
          *This is not a registration for a political party.
        </span>{' '}
        By signing up, you are expressing interest in and supporting the development of a new
        political movement that intends to establish a future political party.
      </p>
    </section>
  );
}
