import React from "react";

export default function About() {
  return (
    <div className="container py-5 text-start">
      <h1 className="mb-4">About Us</h1>
      <p className="lead">
        This project was created for the <strong>2025 UMBC Hackathon</strong> by
        a small team of passionate students. Inspired by the chat and image
        capabilities of modern LLMs, we set out to build a tool that could
        support students during the busy midterms and final seasons.
      </p>

      <h3 className="mt-5">Our Goal</h3>
      <p>
        We designed this platform with <strong>student-centered design</strong>{" "}
        in mind. Our goal is to make studying and collaboration easier, using
        the latest AI-driven tools to create a helpful and accessible resource.
      </p>

      <h3 className="mt-5">The Team</h3>
      <ul>
        <li>
          <strong>Mathew</strong> – Math & Computer Science (AI/ML track) Major,{" "}
          Entrepreneurship & Innovation Minor
        </li>
        <li>
          <strong>Prince Michael</strong> – Math & Computer Science (AI/ML track) Major
        </li>
        <li>
          <strong>Alice</strong> – Biology & Computer Science Major
        </li>
        <li>
          <strong>Muhsin</strong> – Computer Science (Cybersecurity track) Major
        </li>
      </ul>
    </div>
  );
}