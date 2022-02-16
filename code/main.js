import kaboom from "kaboom";

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 390;

// initialize context
kaboom({
  background: [ 128, 128, 128, ]
});


// load assets
loadSprite("bean", "sprites/bean.png");
loadSprite("life", "sprites/apple.png");
loadSound("hit", "sounds/hit.mp3");
loadSound("score", "sounds/score.mp3");
loadSound("woosh", "sounds/wooosh.mp3");

scene("game", () => {
  // keep track of score
  let score = 0;

  let hp = 3;

  let timeValue = 0;

  const scoreLabel = add([
		text("Score: " + score),
		pos(48, 24),
	]);

  const lifeLabel = add([
    text("HP: " + hp),
    pos(520, 24)
  ])

  const timeLabel = add([
    text("Time: " + timeValue),
    pos(48, 96)
  ])

	// define gravity
	gravity(2400);

	// add a game object to screen
	const player = add([
		// list of components
		sprite("bean"),
		pos(80, 40),
		area(),
		body(),
    "player"
	]);

	// floor
	add([
		rect(width(), FLOOR_HEIGHT),
		outline(4),
		pos(0, height()),
		origin("botleft"),
		area(),
		solid(),
		color(127, 200, 255),
	]);

  // wall left
  add([
		rect(FLOOR_HEIGHT, height() + FLOOR_HEIGHT),
		outline(4),
		pos(0, height()),
		origin("botleft"),
		area(),
		solid(),
		color(127, 200, 255),
    "wall"
	]);

  // wall right
  add([
		rect(FLOOR_HEIGHT, height() + FLOOR_HEIGHT),
		outline(4),
		pos(width(), height()),
		origin("botleft"),
		area(),
		solid(),
		color(127, 200, 255),
    "wall2"
	]);

function do_jump() {
  if (player.grounded()) {
    player.jump(JUMP_FORCE);
    play("woosh", {
      volume: 0.5,
      detune: -1200,
    });
  }
}

	// jump when user press space
  keyPress("space", do_jump)
  keyPress("up", do_jump)
	mouseClick(do_jump);

	function spawnTree() {
		// add tree obj

    if(score <= 25) {
      obstacleColor = color(255, 120, 255)
    } else if (score <= 50) {
      obstacleColor = color(255, 140, 0)
    } else if (score <= 100) {
      obstacleColor = color(149, 50, 0)
    } else if (score <= 150) {
      obstacleColor = color(120, 255, 0)
    } else {
      obstacleColor = color(rand(0, 255), rand(0, 255), rand(0, 255))
    }

    amount = rand(0.1, 3)

    if(score * 2 > 100) {
      speed = SPEED + 100
    } else {
      speed = SPEED + score * 2
    }

    up = rand(1,100)

    if(up > 75) {
      yCoord = height() - FLOOR_HEIGHT - 80
    } else {
      yCoord = height() - FLOOR_HEIGHT
    }

		const tree = add([
			rect(48*amount, rand(32, 96)),
			area(),
			outline(4),
			pos(width(), yCoord),
			origin("botleft"),
			obstacleColor,
			move(LEFT, speed),
			"tree",
		]);

    tree.collides("wall", () => {
      destroy(tree)
      score++;
		  scoreLabel.text = "Score: " + score;
      // play("score", {
      //   volume: 0.5,
      //   detune: -1200,
      // });
	  });

		// wait a random amobunt of time to spawn next tree
		wait(rand(0.7, 1.5), spawnTree);
	}

	// start spawning trees
	spawnTree();

  function spawnLife() {
    if(score * 5 + SPEED > 800) {
      speed = 800
    } else {
      speed = score * 5 + SPEED
    }
    const life = add([
			sprite("life"),
			area(),
			outline(3),
			pos(width(), height() - FLOOR_HEIGHT - 110),
			origin("botleft"),
			move(LEFT, speed),
			"life",
		]);
    life.collides("player", () => {
      hp +=3
      play("score", {
        volume: 0.5,
        detune: -1200,
      });
      destroy(life)
      lifeLabel.text =  "HP: " + hp;
    })

    wait(rand(45, 60), spawnLife);
  }

  spawnLife();


  function startTime() {
    timeValue++
    timeLabel.text = "Time: " + timeValue
    wait(1, startTime);
  }

  // start score
  startTime();

  // onKeyDown() registers an event that runs every frame as long as user is holding a  certain key
  keyDown("left", () => {
	  // .move() is provided by pos() component, move by pixels per second
	  player.move(-SPEED, 0)
  })
  keyDown("a", () => {
	  // .move() is provided by pos() component, move by pixels per second
	  player.move(-SPEED, 0)
  })

  keyDown("right", () => {
	  player.move(SPEED, 0)
  })

  keyDown("d", () => {
	  player.move(SPEED, 0)
  })

	// lose if player collides with any game obj with tag "tree"
	player.collides("tree", (tree) => {
		// go to "lose" scene and pass the score
    hp -=1
    play("hit", {
      volume: 0.5,
      detune: -1200,
    });
    addKaboom(player.pos);
    destroy(tree)
    lifeLabel.text =  "HP: " + hp;
    if(hp == 0) {
      go("lose", score, timeValue);
    }
	});
});

scene("lose", (score, timeValue) => {
	add([
		sprite("bean"),
		pos(width() / 2, height() / 2 - 80),
		scale(2),
		origin("center"),
	]);

	// display score
	add([
		text("Punkte: " + score + "\nZeit: " + timeValue + "s"),
		pos(width() / 2, height() / 2 + 80),
		scale(1),
		origin("center"),
	]);

	// go back to game with space is pressed
	keyPress("space", () => go("game"));
	mouseClick(() => go("game"));

});

scene("start", () => {
  add([
		sprite("bean"),
		pos(width() / 2, height() / 2 - 80),
		scale(2),
		origin("center"),
	]);

	// display score
	add([
		text("Hi."),
		pos(width() / 2, height() / 2 + 80),
		scale(2),
		origin("center"),
	]);

	// go back to game with space is pressed
	keyPress("space", () => go("game"));
	mouseClick(() => go("game"));
})

go("start");