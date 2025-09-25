const questions = [
  {
    prompt:
      "Back in the Big Machine baby era, which Nashville writers' round let Taylor be spotted and signed after she fearlessly covered the Dixie Chicks?",
    options: [
      "The Listening Room",
      "Bluebird Café",
      "The Basement East",
      "Station Inn"
    ],
    answer: 1,
    lyric: "Bluebird nights were the true start of the fairytale.",
    success: "Bluebird brilliance! That's where the whole era began.",
    retry: "Think tiny cafe, massive destiny."
  },
  {
    prompt:
      "Swifties know show day mojo: what number did Taylor Sharpie and glitter on her hand before stomping into the Fearless Tour?",
    options: ["7", "9", "13", "22"],
    answer: 2,
    lyric: "13 sparkling down Taylor's wrist like a lucky charm.",
    success: "Thirteen forever! Good luck locked in.",
    retry: "The number echoes through every tour dress change."
  },
  {
    prompt:
      "Which track five from the Speak Now vault of feelings gave us the lyric, 'Maybe we got lost in translation'?",
    options: ["Enchanted", "Dear John", "Haunted", "Last Kiss"],
    answer: 1,
    lyric: "Enchanted secret message: 'Adam' still sends shivers.",
    success: "Enchanted glow achieved. Owl City's heart just felt that.",
    retry: "This waltz sparkles with NYC starlight and perfume."
  },
  {
    prompt:
      "Which vault track returned in 2021 to casually roast a certain Jonas with the line 'Mr. Superior Thinkin\''?",
    options: [
      "Better Man",
      "Mr. Perfectly Fine",
      "Bye Bye Baby",
      "Run"
    ],
    answer: 1,
    lyric: "'Mr. Perfectly Fine' walked out of the vault in full sass.",
    success: "Vault unlocked and the burn is still immaculate.",
    retry: "He hung his name on a door with a matching ego."
  },
  {
    prompt:
      "Taylor moonlights as a songwriter ninja: what pen name did she use to write 'This Is What You Came For'?",
    options: [
      "Robin Sterling",
      "Nils Sjöberg",
      "Stevie Summers",
      "Ella Meredith"
    ],
    answer: 1,
    lyric: "Nils Sjöberg was the sparks-fly alias. Iconic move.",
    success: "Secret identity revealed. Calvin never saw it coming.",
    retry: "That pseudonym sounds Scandinavian and slick."
  },
  {
    prompt:
      "When Taylor told us 'the old Taylor can't come to the phone right now,' which video stacked every past persona on a pile of snakes?",
    options: [
      "Look What You Made Me Do",
      "Ready For It?",
      "End Game",
      "...So It Goes"
    ],
    answer: 0,
    lyric: "The LWYMMD graveyard of Taylors lives rent-free in snake fam minds.",
    success: "Snake queen energy reclaimed!",
    retry: "Ring, ring. New Taylor answering in the bathtub of diamonds."
  },
  {
    prompt:
      "Which 1989 track is Track 13 and became the cleansing rain after the storm of the album?",
    options: ["Clean", "I Know Places", "Wonderland", "New Romantics"],
    answer: 0,
    lyric: "'You're still all over me like a wine-stained dress I can't wear anymore.'",
    success: "Clean break achieved. Welcome to the light rain finale.",
    retry: "This track features Imogen Heap and a wind chime outro."
  },
  {
    prompt:
      "Secret session stories live forever: what did Taylor famously bake for 1989 Secret Sessions guests?",
    options: [
      "Snickerdoodles",
      "Chai sugar cookies",
      "Red velvet cupcakes",
      "Apple pie"
    ],
    answer: 1,
    lyric: "Chai cookie recipe passed down like a Swiftie rite.",
    success: "Cinnamon dusted victory!",
    retry: "Spice it like autumn leaves falling down like pieces into place."
  },
  {
    prompt:
      "In the folklore cinematic universe, which cardigan owner wrote letters to James every summer?",
    options: ["Inez", "Dorothea", "Betty", "Este"],
    answer: 2,
    lyric: "Betty's porch light is always on for James.",
    success: "Cardigan returned safely to Betty's shoulders.",
    retry: "She gets the key around the 17th of August."
  },
  {
    prompt:
      "Which folklore track gave us the devastating bridge, 'I can change everything about me to fit in'?",
    options: ["Peace", "This Is Me Trying", "Mirrorball", "Hoax"],
    answer: 2,
    lyric: "'Mirrorball' is for the people-pleasing dreamers shimmering at midnight.",
    success: "Mirrorball spotlight secured!",
    retry: "Spinning in my highest heels, love."
  },
  {
    prompt:
      "On evermore, which song takes us to the Last Great American Dynasty sequel on Holiday House grounds?",
    options: ["Gold Rush", "No Body, No Crime", "Tis the Damn Season", "Dorothea"],
    answer: 3,
    lyric: "Dorothea went back to the same small town that birthed an empire.",
    success: "Welcome back to the bleachers of Dorothea's hometown!",
    retry: "Think Pennsylvanian yearbook queen."
  },
  {
    prompt:
      "Which bridge queen delivered the lyric 'I'm begging for you to take my hand, wreck my plans'?",
    options: ["Cruel Summer", "Ivy", "Getaway Car", "The Archer"],
    answer: 0,
    lyric: "Cruel Summer's bridge is canonically screamed, not sung.",
    success: "Screamed the bridge exactly right. Jack Antonoff is proud.",
    retry: "Devils roll the dice, angels roll their eyes."
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
  {
    prompt:
      "Which Midnights 3am edition track has Swift referencing Dylan Thomas and the Chelsea Hotel?",
    options: [
      "The Great War",
      "Paris",
      "High Infidelity",
      "Dear Reader"
    ],
    answer: 1,
    lyric: "'In Paris, you know the French have more fun' and poets roam free.",
    success: "Passport stamped in Paris!",
    retry: "She hid in a city of love to dodge gossip pages."
  },
  {
    prompt:
      "Which tour brought back 'long live all the magic we made' with a brand new sparkly Lover bodysuit?",
    options: [
      "1989 World Tour",
      "Reputation Stadium Tour",
      "The Eras Tour",
      "Red Tour"
    ],
    answer: 2,
    lyric: "Eras Tour stitched every timeline into one glittering odyssey.",
    success: "Eras Tour crown secured. Friendship bracelets high!",
    retry: "Thirty-plus songs, thirteen outfits, zero skips."
  },
  {
    prompt:
      "What street did Taylor rent in the West Village that became a song title and legendary fan pilgrimage spot?",
    options: [
      "Cornelia Street",
      "Bleecker Street",
      "MacDougal Street",
      "Commerce Street"
    ],
    answer: 0,
    lyric: "I'll never walk Cornelia Street again...unless it's for photos.",
    success: "Cornelia key obtained. Don't lose it, babe.",
    retry: "The song is hidden on Lover and references neon in the kitchen."
  },
  {
    prompt:
      "Which Reputation track features Big Reputation chants and an I heart TS crop top callback?",
    options: ["End Game", "Delicate", "King Of My Heart", "This Is Why We Can't Have Nice Things"],
    answer: 3,
    lyric: "Bridge champagne toasts and snake fountains forever.",
    success: "Toast smashed with bestie-level cackling.",
    retry: "We can't have nice things because we dunked on the drama."
  },
  {
    prompt:
      "Which collaborator joins Taylor on 'exile' trading lines like a cinematic duet?",
    options: ["Bon Iver", "The National", "Phoebe Bridgers", "Marcus Mumford"],
    answer: 0,
    lyric: "Justin Vernon's baritone plus Taylor's sighs = folklore goosebumps.",
    success: "Exile exit door found.",
    retry: "He also appears on 'Evermore' the song."
  },
  {
    prompt:
      "In 2020, Taylor called herself a 'pathological people pleaser' in what journal-entry style song?",
    options: ["Peace", "The Archer", "Nothing New", "You're On Your Own, Kid"],
    answer: 3,
    lyric: "YOYOK taught us to make friendship bracelets, then burn the town down.",
    success: "Kid, you're definitely not on your own anymore.",
    retry: "This track sits at number five on Midnights."
  },
  {
    prompt:
      "Which Taylor track slyly references the words 'auroras and sad prose' while plotting a heist of a heart?",
    options: ["Ivy", "Cowboy Like Me", "Mastermind", "Bejeweled"],
    answer: 2,
    lyric: "Mastermind spilled the cosmic scheming tea at track eleven.",
    success: "Plan executed flawlessly. Taylor Nation salutes you.",
    retry: "'So I told you none of it was accidental.'"
  },
  {
    prompt:
      "The lyric 'and my waves meet your shore' belongs to which evermore deep cut sea shanty of longing?",
    options: ["Right Where You Left Me", "Coney Island", "Happiness", "Ivy"],
    answer: 1,
    lyric: "Coney Island aches like a winter boardwalk date.",
    success: "Ferris wheel feelings unlocked.",
    retry: "Features The National and a carousel of regret."
  },
  {
    prompt:
      "Which vault queen from Red (Taylor's Version) recruited Phoebe Bridgers for a duet?",
    options: ["The Very First Night", "Forever Winter", "Nothing New", "I Bet You Think About Me"],
    answer: 2,
    lyric: "Nothing New made every elder millennial Swiftie sob.",
    success: "Phoebe just sent you a skeleton sticker of approval.",
    retry: "It's the one about aging in the spotlight."
  },
  {
    prompt:
      "Taylor's lucky seagull sweatshirt on folklore merch nods to which Rhode Island hideaway?",
    options: ["Watch Hill", "Block Island", "Newport", "Narragansett"],
    answer: 0,
    lyric: "Watch Hill mansion = summer castle of the Swiftian realm.",
    success: "Rhode Island salt air in your lungs!",
    retry: "It's the town that holds the Holiday House."
  },
  {
    prompt:
      "Which debut album deep cut mentions dancing around the kitchen in the refrigerator light before New Year's Day made it famous?",
    options: ["Mary's Song (Oh My My My)", "Our Song", "Stay Beautiful", "A Place in This World"],
    answer: 0,
    lyric: "Mary's Song foreshadowed forever and always at thirteen.",
    success: "You remembered the 2 a.m. kitchen twirls!",
    retry: "It's the one about the neighbor boy growing up next door."
  },
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
  {
    prompt:
      "In the Lover era, which track paints technicolor around 'painting your brother's wall'?",
    options: ["Daylight", "Paper Rings", "I Think He Knows", "London Boy"],
    answer: 1,
    lyric: "Paper Rings is rainbow glitter and thrift store vows.",
    success: "You'd marry that song with paper rings too.",
    retry: "She loves sparkly things, but she'd marry you with these."
  },
  {
    prompt:
      "Which deluxe folklore track traps us in a diner forever at the same table?",
    options: ["Right Where You Left Me", "The Lakes", "It's Time To Go", "Hoax"],
    answer: 0,
    lyric: "Right Where You Left Me frozen in time at that restaurant.",
    success: "Stillness mastered. Time traveler unlocked.",
    retry: "She never left the booth after the breakup."
  },
  {
    prompt:
      "On which Midnights bonus track does Taylor snarl, 'Don't get sad, get even'?",
    options: ["Would've Could've Should've", "Vigilante Sh*t", "Glitch", "Sweet Nothing"],
    answer: 1,
    lyric: "Cat eye liner sharp enough to cut villains.",
    success: "Justice served with a winged liner flair.",
    retry: "It's the one where she dresses for revenge."
  },
  {
    prompt:
      "Who does Taylor team up with on 'The Last Time' to plead for one more miracle?",
    options: ["Gary Lightbody", "Chris Stapleton", "Keith Urban", "Marcus Mumford"],
    answer: 0,
    lyric: "Snow Patrol's Gary Lightbody made Red extra haunting.",
    success: "The duet door has officially been opened.",
    retry: "Think Snow Patrol frontman."
  }
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
const statusEl = document.getElementById("status");
const progressFill = document.querySelector(".progress-fill");
const currentCount = document.getElementById("current");
const celebration = document.getElementById("celebration");
const confettiContainer = document.querySelector(".confetti");

let currentIndex = 0;

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
