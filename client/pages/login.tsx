import Head from "next/head";
import Gistbin from "../components/Gistbin";
import Navbar from "../components/Navbar";
import Login from "../components/Login";
import Footer from "../components/Footer";
import Section from "../components/Section";

export default function LoginPage() {
  return (
    <Section>
      <Head>
        <title>Gistbin | Login</title>
        <meta name="description" content="Gistbin project made by asxraj" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Login />
      <Footer />
    </Section>
  );
}
