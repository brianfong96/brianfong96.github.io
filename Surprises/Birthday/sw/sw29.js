const questions = [
  {
    prompt:
      "At which Nashville venue did Scott Borchetta first see Taylor Swift perform as a teenager, leading to her Big Machine signing?",
    options: ["The Listening Room", "Bluebird Café", "The Basement East", "Station Inn"],
    answer: 1,
    lyric: "Bluebird nights were the true start of the fairytale.",
    success: "Bluebird brilliance! That's where the whole era began.",
    retry: "Think tiny cafe, massive destiny."
  }, 
  // Source (official venue history): https://bluebirdcafe.com/about/history/

  {
    prompt:
      "Swifties know show day mojo: what number did Taylor Sharpie and glitter on her hand before stomping into the Fearless Tour?",
    options: ["7", "9", "13", "22"],
    answer: 2,
    lyric: "13 sparkling down Taylor's wrist like a lucky charm.",
    success: "Thirteen forever! Good luck locked in.",
    retry: "The number echoes through every tour dress change."
  }, 
  // Source: https://www.insider.com/taylor-swift-number-13-meaning-2019-8

  {
    prompt:
      "Which Red track gave us the lyric, 'Maybe we got lost in translation'?",
    options: ["Enchanted", "Dear John", "All Too Well", "Last Kiss"],
    answer: 2,
    lyric: "All Too Well shattered hearts with that translation line.",
    success: "Ten minutes, scarf and all — you nailed it.",
    retry: "This track five is her magnum opus of heartbreak."
  }, 
  // Source (lyrics): https://taylorswiftlyrics.org/lyrics/all-too-well-taylor-s-version

  {
    prompt:
      "Which vault track released in 2021 includes the lyric 'Mr. Superior Thinking'?",
    options: ["Better Man", "Mr. Perfectly Fine", "I Bet You Think About Me", "Bye Bye Baby"],
    answer: 2,
    lyric: "'Mr. Superior Thinking' appears in “I Bet You Think About Me.”",
    success: "Yes — that lyric comes from *I Bet You Think About Me* (Red vault).",
    retry: "Hint: It’s from a Red vault song, not Fearless."
  },

  {
    prompt:
      "Taylor moonlights as a songwriter ninja: what pen name did she use to write 'This Is What You Came For'?",
    options: ["Robin Sterling", "Nils Sjöberg", "Stevie Summers", "Ella Meredith"],
    answer: 1,
    lyric: "Nils Sjöberg was the sparks-fly alias. Iconic move.",
    success: "Secret identity revealed. Calvin never saw it coming.",
    retry: "That pseudonym sounds Scandinavian and slick."
  }, 
  // Source (news report): https://www.bbc.com/news/entertainment-arts-36785305

  {
    prompt:
      "When Taylor told us 'the old Taylor can't come to the phone right now,' which video stacked every past persona on a pile of snakes?",
    options: ["Look What You Made Me Do", "Ready For It?", "End Game", "...So It Goes"],
    answer: 0,
    lyric: "The LWYMMD graveyard of Taylors lives rent-free in snake fam minds.",
    success: "Snake queen energy reclaimed!",
    retry: "Ring, ring. New Taylor answering in the bathtub of diamonds."
  }, 
  // Source (video coverage): https://www.nme.com/news/music/taylor-swift-look-what-you-made-me-do-video-2131729

  {
    prompt:
      "Which 1989 track is Track 13 and became the cleansing rain after the storm of the album?",
    options: ["Clean", "I Know Places", "Wonderland", "New Romantics"],
    answer: 0,
    lyric: "'You're still all over me like a wine-stained dress I can't wear anymore.'",
    success: "Clean break achieved. Welcome to the light rain finale.",
    retry: "This track features Imogen Heap and a wind chime outro."
  }, 
  // Source: https://en.wikipedia.org/wiki/1989_(Taylor_Swift_album)

  {
    prompt:
      "Secret session stories live forever: what did Taylor famously bake for 1989 Secret Sessions guests?",
    options: ["Snickerdoodles", "Chai sugar cookies", "Red velvet cupcakes", "Apple pie"],
    answer: 1,
    lyric: "Chai cookie recipe passed down like a Swiftie rite.",
    success: "Cinnamon dusted victory!",
    retry: "Spice it like autumn leaves falling down like pieces into place."
  }, 
  // Source: https://www.today.com/food/taylor-swift-shares-famous-chai-sugar-cookie-recipe-fans-t240223

  {
    prompt:
      "In folklore’s love-triangle trilogy, who is James’s girlfriend at the center of 'betty' and referenced in 'cardigan'?",
    options: ["Inez", "Dorothea", "Betty", "Este"],
    answer: 2,
    lyric: "Betty's porch light is always on for James.",
    success: "Cardigan returned safely to Betty's shoulders.",
    retry: "She gets the key around the 17th of August."
  }, 
  // Source (Swift discussed the triangle; Betty is James’s girlfriend): https://ew.com/music/taylor-swifts-teenage-love-triangle-songs-folklore-explained/

  {
    prompt:
      "Which folklore track gave us the devastating bridge, 'I can change everything about me to fit in'?",
    options: ["Peace", "This Is Me Trying", "Mirrorball", "Hoax"],
    answer: 2,
    lyric: "'Mirrorball' is for the people-pleasing dreamers shimmering at midnight.",
    success: "Mirrorball spotlight secured!",
    retry: "Spinning in my highest heels, love."
  }, 
  // Source (lyrics): https://genius.com/Taylor-swift-mirrorball-lyrics

  {
    prompt:
      "Which *evermore* song includes the lines 'You got shiny friends since you left town' and invites the title character to 'come back to my side'?",
    options: ["Gold Rush", "No Body, No Crime", "Tis the Damn Season", "Dorothea"],
    answer: 3,
    lyric: "Dorothea went back to the same small town that birthed an empire.",
    success: "Welcome back to the bleachers of Dorothea's hometown!",
    retry: "Think Pennsylvanian yearbook queen."
  }, 
  // Source (lyrics): https://taylorswiftlyrics.org/lyrics/dorothea

  {
    prompt:
      "Which Taylor Swift song repeats the lyric 'I'm begging for you to take my hand, wreck my plans, that's my man'?",
    options: ["willow", "ivy", "Getaway Car", "The Archer"],
    answer: 0,
    lyric: "From the chorus of 'willow' (evermore, 2020).",
    success: "That's my man! You nailed 'willow.'",
    retry: "Hint: evermore’s witchy lead single."
  },

  {
    prompt:
      "Taylor told us to 'meet me at midnight' on which Midnights opener?",
    options: ["Lavender Haze", "Maroon", "Midnight Rain", "Karma"],
    answer: 0,
    lyric: "Lavender Haze kicked off the sleepless 3am confessions.",
    success: "You've officially entered the Lavender Haze.",
    retry: "Think purple, soft focus, zodiac conspiracies."
  }, 
  // Source (lyrics): https://genius.com/Taylor-swift-lavender-haze-lyrics

  {
    prompt:
      "Which 2024 title track includes the line “You’re not Dylan Thomas, I’m not Patti Smith / This ain’t the Chelsea Hotel”?",
    options: ["The Great War", "Paris", "The Tortured Poets Department", "Dear Reader"],
    answer: 2,
    lyric: "The title track of TTPD nodded to tortured poets and Chelsea nights.",
    success: "Poets department unlocked!",
    retry: "Think 2024 album drop, not Midnights."
  }, 
  // Source (lyrics): https://lyrics.ws/taylor-swift/the-tortured-poets-department

  {
    prompt:
      "Which tour brought back 'long live all the magic we made' with a brand new sparkly Lover bodysuit?",
    options: ["1989 World Tour", "Reputation Stadium Tour", "The Eras Tour", "Red Tour"],
    answer: 2,
    lyric: "Eras Tour stitched every timeline into one glittering odyssey.",
    success: "Eras Tour crown secured. Friendship bracelets high!",
    retry: "Thirty-plus songs, thirteen outfits, zero skips."
  }, 
  // Source (performance reported): https://www.rollingstone.com/music/music-news/taylor-swift-long-live-eras-tour-1234787591/

  {
    prompt:
      "What street did Taylor rent in the West Village that became a song title and legendary fan pilgrimage spot?",
    options: ["Cornelia Street", "Bleecker Street", "MacDougal Street", "Commerce Street"],
    answer: 0,
    lyric: "I'll never walk Cornelia Street again...unless it's for photos.",
    success: "Cornelia key obtained. Don't lose it, babe.",
    retry: "The song is hidden on Lover and references neon in the kitchen."
  }, 
  // Source: https://www.vogue.com/article/taylor-swift-cornelia-street-apartment

  {
    prompt:
      "Which Reputation track repeats the chant 'Big reputation, big reputation'?",
    options: ["End Game", "Delicate", "King Of My Heart", "This Is Why We Can't Have Nice Things"],
    answer: 0,
    lyric: "End Game flexed those big reputation vibes with Future and Ed.",
    success: "Big rep nailed. Squad goals confirmed.",
    retry: "Think the collab-heavy single from Reputation."
  }, 
  // Source (lyrics): https://taylorswiftlyrics.org/lyrics/end-game

  {
    prompt:
      "Which collaborator joins Taylor on 'exile' trading lines like a cinematic duet?",
    options: ["Bon Iver", "The National", "Phoebe Bridgers", "Marcus Mumford"],
    answer: 0,
    lyric: "Justin Vernon's baritone plus Taylor's sighs = folklore goosebumps.",
    success: "Exile exit door found.",
    retry: "He also appears on 'Evermore' the song."
  }, 
  // Source (credits/lyrics): https://genius.com/Taylor-swift-exile-lyrics

  {
    prompt:
      "Taylor called herself a 'pathological people pleaser' in which Midnights-era vault track?",
    options: ["You're On Your Own, Kid", "You're Losing Me", "The Archer", "Nothing New"],
    answer: 1,
    lyric: "From 'You're Losing Me' (Midnights: Late Night Edition, 2023).",
    success: "You found the vault! That's the song where Taylor admits she's a 'pathological people pleaser.'",
    retry: "Hint: it wasn't on the standard Midnights release—think Late Night Edition."
  },

  {
    prompt:
      "Which folklore bonus track's bridge opens with the lyric 'I want auroras and sad prose'?",
    options: ["Ivy", "Cowboy Like Me", "The Lakes", "Bejeweled"],
    answer: 2,
    lyric: "The Lakes spilled its literary ink in floral fields.",
    success: "Auroras spotted — poetic victory!",
    retry: "Think Windermere and Wordsworth."
  }, 
  // Source (lyrics): https://genius.com/Taylor-swift-the-lakes-lyrics

  {
    prompt:
      "The lyric 'and my waves meet your shore' belongs to which evermore track?",
    options: ["Right Where You Left Me", "Long Story Short", "Happiness", "Ivy"],
    answer: 1,
    lyric: "Long Story Short surfed waves into a calmer ending.",
    success: "Shoreline met — story wrapped up.",
    retry: "This one was the upbeat resolution on evermore."
  }, 
  // Source (lyrics): https://genius.com/Taylor-swift-long-story-short-lyrics

  {
    prompt:
      "Which vault queen from Red (Taylor's Version) recruited Phoebe Bridgers for a duet?",
    options: ["The Very First Night", "Forever Winter", "Nothing New", "I Bet You Think About Me"],
    answer: 2,
    lyric: "Nothing New made every elder millennial Swiftie sob.",
    success: "Phoebe just sent you a skeleton sticker of approval.",
    retry: "It's the one about aging in the spotlight."
  }, 
  // Source (credits/lyrics): https://genius.com/Taylor-swift-nothing-new-lyrics

  {
    prompt:
      "Taylor's iconic seagull sweatshirt, prominent on her 1989 album cover, is often associated with which seaside location?",
    options: ["Watch Hill", "Block Island", "Newport", "Narragansett"],
    answer: 0,
    lyric: "Watch Hill mansion = summer castle of the Swiftian realm.",
    success: "Rhode Island salt air in your lungs!",
    retry: "It's the town that holds the Holiday House."
  }, 
  // Source (home location): https://www.architecturaldigest.com/story/taylor-swift-rhode-island-mansion

  {
    prompt:
      "Which Taylor track first gave us the lyric 'dancing around the kitchen in the refrigerator light'?",
    options: ["Mary's Song (Oh My My My)", "Our Song", "All Too Well (10 Minute Version)", "A Place in This World"],
    answer: 2,
    lyric: "All Too Well immortalized the kitchen twirl heartbreak.",
    success: "You remembered the 2 a.m. kitchen twirls!",
    retry: "It's the ten-minute masterpiece from Red (Taylor's Version)."
  }, 
  // Source (lyrics): https://taylorswiftlyrics.org/lyrics/all-too-well-taylor-s-version

  {
    prompt:
      "Which Taylor short film features Sadie Sink and Dylan O'Brien living out a scarf-stealing heartbreak?",
    options: [
      "All Too Well: The Short Film",
      "Cardigan (Folklore: The Long Pond Studio Sessions)",
      "The Man",
      "Begin Again"
    ],
    answer: 0,
    lyric: "Thirteen minutes of emotional devastation and a kitchen dance.",
    success: "All Too Well tissues deployed.",
    retry: "It won a VMA for Video of the Year in 2022."
  }, 
  // Source (casting/award): https://www.billboard.com/music/awards/taylor-swift-all-too-well-video-of-the-year-vmas-1235130017/

  {
    prompt:
      "In the Lover era, which track paints technicolor around 'painting your brother's wall'?",
    options: ["Daylight", "Paper Rings", "I Think He Knows", "London Boy"],
    answer: 1,
    lyric: "Paper Rings is rainbow glitter and thrift store vows.",
    success: "You'd marry that song with paper rings too.",
    retry: "She loves sparkly things, but she'd marry you with these."
  }, 
  // Source (lyrics): https://genius.com/Taylor-swift-paper-rings-lyrics

  {
    prompt:
      "Which deluxe evermore track traps us in a diner forever at the same table?",
    options: ["Right Where You Left Me", "The Lakes", "It's Time To Go", "Hoax"],
    answer: 0,
    lyric: "Right Where You Left Me frozen in time at that restaurant.",
    success: "Stillness mastered. Time traveler unlocked.",
    retry: "She never left the booth after the breakup."
  }, 
  // Source (lyrics): https://genius.com/Taylor-swift-right-where-you-left-me-lyrics

  {
    prompt:
      "On which Midnights track does Taylor snarl, 'Don't get sad, get even'?",
    options: ["Would've Could've Should've", "Vigilante Shit", "Glitch", "Sweet Nothing"],
    answer: 1,
    lyric: "Cat eye liner sharp enough to cut villains.",
    success: "Justice served with a winged liner flair.",
    retry: "It's the one where she dresses for revenge."
  }, 
  // Source (lyrics): https://taylorswiftlyrics.org/lyrics/vigilante-shit

  {
    prompt:
      "Who does Taylor team up with on 'The Last Time' to plead for one more miracle?",
    options: ["Gary Lightbody", "Chris Stapleton", "Keith Urban", "Marcus Mumford"],
    answer: 0,
    lyric: "Snow Patrol's Gary Lightbody made Red extra haunting.",
    success: "The duet door has officially been opened.",
    retry: "Think Snow Patrol frontman."
  } 
  // Source (credits/lyrics): https://genius.com/Taylor-swift-the-last-time-lyrics
];


const headingPhrases = [
  "Ready for it?",
  "Drop everything now",
  "We're in our Swiftie era",
  "It was rare, I was there",
  "Meet me at midnight",
  "Long live this moment",
  "You play stupid games...",
  "Darling, I'm a nightmare",
  "Holy ground energy",
  "Speak now or sparkle",
  "Starlight mission",
  "We were jet-set",
  "Magic, madness, heaven, sin",
  "So make the friendship bracelets",
  "Gorgeous, baby",
  "Heartbreak prince quiz",
  "Lover of riddles",
  "Folklorian folklore",
  "I come back stronger",
  "Karma is the breeze",
  "Mastermind mode",
  "Eras encore",
  "Cardigan confessional",
  "Fearless and twenty-nine",
  "The Story of Us",
  "Delicate dares",
  "Gold rush glitter",
  "Champagne problems club",
  "Swiftmas surprise"
];

const questionCard = document.getElementById("question-card");
const questionNumber = document.querySelector(".question-number");
const heading = document.getElementById("heading");
const prompt = document.getElementById("prompt");
const optionsWrap = document.querySelector(".options");
const lyricNote = document.getElementById("lyric-note");
const hintToggle = document.getElementById("hint-toggle");
const statusEl = document.getElementById("status");
const progressFill = document.querySelector(".progress-fill");
const currentCount = document.getElementById("current");
const celebration = document.getElementById("celebration");
const confettiContainer = document.querySelector(".confetti");

let currentIndex = 0;
const HINT_SHOW_LABEL = "Need a hint?";
const HINT_HIDE_LABEL = "Hide hint";

function buildConfetti() {
  const colors = [
    "#ff5ec7",
    "#ffe066",
    "#70d6ff",
    "#cfa7ff",
    "#98f6c2",
    "#ff8fab"
  ];

  for (let i = 0; i < 140; i += 1) {
    const piece = document.createElement("span");
    const color = colors[i % colors.length];
    piece.style.background = color;
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 4}s`;
    piece.style.animationDuration = `${3 + Math.random() * 2}s`;
    piece.style.opacity = `${0.6 + Math.random() * 0.4}`;
    confettiContainer.appendChild(piece);
  }
}

function updateProgress() {
  currentCount.textContent = currentIndex;
  const percentage = (currentIndex / questions.length) * 100;
  progressFill.style.width = `${percentage}%`;
}

function setHeading() {
  const phrase = headingPhrases[currentIndex % headingPhrases.length];
  heading.textContent = phrase;
}

function renderQuestion() {
  if (!questions[currentIndex]) {
    return;
  }

  setHeading();
  questionNumber.textContent = currentIndex + 1;
  prompt.textContent = questions[currentIndex].prompt;
  lyricNote.textContent = questions[currentIndex].lyric;
  lyricNote.hidden = true;
  lyricNote.classList.remove("revealed");
  hintToggle.textContent = HINT_SHOW_LABEL;
  hintToggle.setAttribute("aria-expanded", "false");
  statusEl.textContent = "";
  optionsWrap.innerHTML = "";

  questionCard.classList.remove("leaving");
  questionCard.classList.remove("entering");
  void questionCard.offsetWidth;
  questionCard.classList.add("entering");

  questions[currentIndex].options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => handleChoice(index, button));
    optionsWrap.appendChild(button);
  });
}

function toggleHint() {
  const willReveal = lyricNote.hidden;

  if (willReveal) {
    lyricNote.hidden = false;
    lyricNote.classList.add("revealed");
    hintToggle.textContent = HINT_HIDE_LABEL;
    hintToggle.setAttribute("aria-expanded", "true");
  } else {
    lyricNote.hidden = true;
    lyricNote.classList.remove("revealed");
    hintToggle.textContent = HINT_SHOW_LABEL;
    hintToggle.setAttribute("aria-expanded", "false");
  }
}

function handleChoice(selection, button) {
  const data = questions[currentIndex];
  if (!data) return;

  if (selection === data.answer) {
    Array.from(optionsWrap.children).forEach((child) => {
      child.disabled = true;
      if (child !== button) {
        child.classList.add("faded");
      }
    });

    button.classList.add("correct");
    statusEl.textContent = data.success;

    setTimeout(() => {
      questionCard.classList.remove("entering");
      questionCard.classList.add("leaving");
    }, 300);

    currentIndex += 1;
    updateProgress();

    setTimeout(() => {
      if (currentIndex >= questions.length) {
        triggerCelebration();
      } else {
        questionCard.classList.remove("leaving");
        renderQuestion();
      }
    }, 850);
  } else {
    button.classList.add("wrong");
    statusEl.textContent = data.retry;
    setTimeout(() => {
      button.classList.remove("wrong");
    }, 500);
  }
}

function triggerCelebration() {
  confettiContainer.classList.add("show");
  celebration.setAttribute("aria-hidden", "false");
  celebration.classList.add("show");
  statusEl.textContent = "";
  questionCard.remove();
  document.querySelector("footer").textContent =
    "You conquered all twenty nine. That's how you get the girl.";
}

buildConfetti();
renderQuestion();
updateProgress();
hintToggle.addEventListener("click", toggleHint);
