import Reveal from "../components/Reveal";

export default function Contact() {
  return (
    <section className="panel">
      <Reveal><h2>Contact us</h2></Reveal>
      <Reveal delay={80}>
        <p className="lead">Have a question or want to know more about how SmartCX works? Send a message and we'll get back to you.</p>
      </Reveal>
      <Reveal delay={150}>
        <div className="contact-box">
          <input type="text" placeholder="Your name" />
          <input type="email" placeholder="Your email" />
          <textarea rows="4" placeholder="Your message" />
          <button className="btn btn-solid" onClick={() => alert("Thanks! Wire this to a form service like Formspree.")}>Send message</button>
        </div>
      </Reveal>
    </section>
  );
}
