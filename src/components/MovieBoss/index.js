import React, { useState } from "react";
import movieBoss from "../../assets/images/movieboss.png";
import sendBtnIcon from "../../assets/images/send-btn-icon.png";
import loadingSvg from "../../assets/images/loading.svg";
import OpenAI from "openai";

import styles from "./index.module.css";

const openai = new OpenAI({
  //   organization: "org-SQrjxDJWxQPfLLHIIY7hqN4p",
  apiKey: process.env.REACT_APP__OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const MovieBoss = () => {
  const [inputValue, setInputValue] = useState();
  const [bossText, setBossText] = useState(
    "Give me a one-sentence concept and I'll give you an eye-catching title, a synopsis the studios will love, a movie poster... AND choose the cast!"
  );
  const [synopsisValue, setSynopsisValue] = useState();
  const [title, setTitle] = useState();
  const [casting, setCasting] = useState();
  const [image, setImage] = useState();
  const [loader, setLoader] = useState(false);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    if (inputValue && inputValue.length && !synopsisValue)
      setBossText(
        "Ok, just wait a second while my digital brain digests that..."
      );
    if (
      inputValue &&
      inputValue.length &&
      synopsisValue &&
      synopsisValue.length
    ) {
      setBossText(
        `This idea is so good I'm jealous! It's gonna make you rich for sure! Remember, I want 10% 💰`
      );
    }
    // fetchBotReply(inputValue);
  };

  const handleViewPitchButton = () => {
    fetchSynopsis(inputValue);
  };

  //   async function fetchBotReply(outline) {
  //     const response = await openai.completions.create({
  //       model: "text-davinci-003",
  //       prompt: `Generate a short message to enthusiastically say the outline sounds interesting and that you need some minutes to think about it.
  //         ###
  //         outline: Barbie is creating a whole Barbie army
  //         message: Wow Barbie creating her army of Barbies sounds really cool and scary, give me a minute to think about this and I'll get back to you!
  //         ###
  //         outline: Two dogs fall in love and move to Hawaii to learn to surf.
  //         message: I'll need to think about that. But your idea is amazing! I love the bit about Hawaii!
  //         ###
  //         outline: ${outline}
  //         message:
  //         `,
  //       max_tokens: 60,
  //     });
  //     setBossText(response.choices[0].text.trim());
  //   }

  async function fetchSynopsis(outline) {
    setLoader(true);
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt: `Generate an engaging, professional and marketable movie synopsis based on an outline. The synopsis should include actors names in brackets after each character. Choose actors that would be ideal for this role.
        ###
        outline: A big-headed daredevil fighter pilot goes back to school only to be sent on a deadly mission.
        synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When hotshot fighter pilot Maverick [Tom Cruise] is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman [Val Kilmer]. But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte Blackwood [Kelly McGillis]. Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.
        ###
        outline:${outline}
        synopsis:
        `,
      max_tokens: 560,
    });
    setLoader(false);
    const synopsis = response.choices[0].text.trim();
    setSynopsisValue(synopsis);
    fetchTitle(synopsis);
    setBossText(
      `This idea is so good I'm jealous! It's gonna make you rich for sure! Remember, I want 10% 💰`
    );
    // fetchStars(synopsis);
  }

  async function fetchTitle(synopsis) {
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt: `Generate an eccentric movie title based on this synopsis": ${synopsis}.`,
      max_tokens: 200,
      temperature: 0.8,
    });
    const title = response.choices[0].text.trim();
    setTitle(title);
    fetchImagePrompt(title, synopsis);
  }

  //   async function fetchStars(synopsis) {
  //     const response = await openai.createCompletion({
  //       model: "text-davinci-003",
  //       prompt: `Extract the actors names in brackets from the synopsis.
  //         ###
  //         synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When hotshot fighter pilot Maverick [Tom Cruise] is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman [Val Kilmer]. But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte Blackwood [Kelly McGillis]. Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.
  //         names: Tom Cruise, Val Kilmer, Kelly McGillis
  //         ###
  //         synopsis:${synopsis}
  //         names:
  //       `,
  //       max_tokens: 35,
  //     });
  //     setCasting(response.data.choices[0].text.trim());
  //   }

  async function fetchImagePrompt(title, synopsis) {
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt: `Give a description of an image that can be used to advertise a movie based on the title and synopsis. The description should be rich in visual detail but contain no names
      ###
      title: The surfing unicorn.
      synopsis: This unicorn is truly amazing, she thinks she is a dolphin, so she loves the water, spends her time enjoying the ocean. She found a passion: surfing. She then decided to travel the world to find the biggest waves to surf them and won multiple gold medals for her amazing talent!
      description: an animal that is half unicorn half dolphin on a surf board surfing a big wave with a beautiful sunset in the background. 
      ###
      synopsis:${synopsis}
      title:${title}
      description:
      `,
      temperature: 0.8,
      max_tokens: 100,
    });
    fetchImageUrl(response.choices[0].text.trim());
  }

  async function fetchImageUrl(imagePrompt) {
    const response = await openai.images.generate({
      prompt: `${imagePrompt} There should be no text in this image`,
      n: 1,
      size: "256x256",
      response_format: "b64_json",
    });
    if (response.data.data) {
      setImage(`data:image/png;base64,${response.data.data[0].b64_json}`);
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.setupContainer}>
          <img className={styles.imageBoss} src={movieBoss} alt="movie boss" />
          <div className={styles.speechBubbleAi}>
            <p className={styles.movieBossText}>{bossText}</p>
          </div>
        </div>

        <div className={styles.inputContainer}>
          {loader ? (
            <img src={loadingSvg} className={styles.loading} alt="loader" />
          ) : (
            <>
              <textarea
                value={inputValue}
                onChange={handleChange}
                placeholder="An evil genius wants to take over the world using AI."
              />
              <button
                className={styles.sendBtn}
                onClick={handleButtonClick}
                aria-label="send"
              >
                <img src={sendBtnIcon} alt="send" />
              </button>
            </>
          )}
        </div>
      </div>

      {synopsisValue ? (
        <section className={styles.outputContainer}>
          <div className={styles.outputImgContainer}>
            <img
              className={styles.generatedImage}
              alt="generated"
              src={image}
            />
          </div>

          <h1>{title}</h1>
          <h2>{casting}</h2>
          <p>{synopsisValue}</p>
        </section>
      ) : (
        <div />
      )}
      {!synopsisValue ? (
        <button
          className={styles.viewPitchBtn}
          onClick={handleViewPitchButton}
          aria-label="send"
        >
          View Pitch
        </button>
      ) : (
        <div />
      )}
    </>
  );
};

export default MovieBoss;
