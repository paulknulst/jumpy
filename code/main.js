  import kaboom from "kaboom";

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 300;

// initialize context
kaboom();


// load assets
loadSprite("bean", "sprites/bean.png");
loadSound("hit", "sounds/hit.mp3")
loadSound("score", "sounds/score.mp3")

scene("game", () => {
  // keep track of score
  let score = 0;

  let hp = 8

	// define gravity
	gravity(2400);

	// add a game object to screen
	const player = add([
		// list of components
		sprite("bean"),
		pos(80, 40),
		area(),
		body(),
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

	function jump() {
		if (player.grounded()) {
			player.jump(JUMP_FORCE);
		}
	}

	// jump when user press space
	keyPress("space", jump);
	mouseClick(jump);

	function spawnTree() {
		// add tree obj
		const tree = add([
			rect(48, rand(32, 96)),
			area(),
			outline(4),
			pos(width(), height() - FLOOR_HEIGHT),
			origin("botleft"),
			color(255, 180, 255),
			move(LEFT, score*2 + SPEED),
			"tree",
		]);

    tree.collides("wall", () => {
      destroy(tree)
      score++;
		  scoreLabel.text = "Score: " + score;
      play("hit", {
        volume: 0.5,
        detune: -1200,
      });
	  });

		// wait a random amobunt of time to spawn next tree
		wait(rand(0.5, 1.5), spawnTree);
	}

	// start spawning trees
	spawnTree();

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
	player.collides("tree", () => {
		// go to "lose" scene and pass the score
    hp -=1
    play("score", {
      volume: 0.5,
      detune: -1200,
    });
    addKaboom(player.pos);
    lifeLabel.text =  "HP: " + hp;
    if(hp == 0) {
      go("lose", score);
    }
	});

	const scoreLabel = add([
		text("Score: " + score),
		pos(48, 24),
	]);

  const lifeLabel = add([
    text("HP: " + hp),
    pos(520, 24)
  ])

});

scene("lose", (score) => {

	add([
		sprite("bean"),
		pos(width() / 2, height() / 2 - 80),
		scale(2),
		origin("center"),
	]);

	// display score
	add([
		text(score),
		pos(width() / 2, height() / 2 + 80),
		scale(2),
		origin("center"),
	]);

	// go back to game with space is pressed
	keyPress("space", () => go("game"));
	mouseClick(() => go("game"));

});

go("game");