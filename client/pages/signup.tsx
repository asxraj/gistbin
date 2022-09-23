import Head from "next/head";
import Gistbin from "../components/Gistbin";
import Navbar from "../components/Navbar";
import Signup from "../components/Signup";
import Footer from "../components/Footer";
import Section from "../components/Section";

export default function SignupPage() {
  return (
    <Section>
      <Head>
        <title>Gistbin | Signup</title>
        <meta name="description" content="Gistbin project made by asxraj" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Signup />
      <Footer />
    </Section>
  );
}
