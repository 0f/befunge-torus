(function() {
  var Befunge, BefungeDelegate, Direction, Examples, Main, Output, Stack, StackDynamic, State, Torus, Wheel, World, util,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Direction = {
    Up: 0,
    Down: 1,
    Left: 2,
    Right: 3
  };

  State = {
    Run: 0,
    Read: 1
  };

  BefungeDelegate = (function() {
    function BefungeDelegate() {}

    BefungeDelegate.prototype.getNum = function() {
      return 0;
    };

    BefungeDelegate.prototype.getChar = function() {
      return "@";
    };

    BefungeDelegate.prototype.putNum = function(n) {
      return console.log(n);
    };

    BefungeDelegate.prototype.putChar = function(c) {
      return console.log(c);
    };

    BefungeDelegate.prototype.pushStack = function(n) {};

    BefungeDelegate.prototype.popStack = function() {};

    BefungeDelegate.prototype.readCode = function(y, x, c) {};

    BefungeDelegate.prototype.writeCode = function(y, x, from, to) {};

    return BefungeDelegate;

  })();

  Befunge = (function() {
    function Befunge(code, delegate) {
      var i, k, line, _i, _j, _len, _ref, _ref1, _ref2;
      this.delegate = delegate != null ? delegate : new BefungeDelegate;
      this.program = (function() {
        var _i, _len, _ref, _results;
        _ref = code.split("\n");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          line = _ref[_i];
          _results.push(line.split(""));
        }
        return _results;
      })();
      this.size = {
        x: Math.max.apply(Math, (function() {
          var _i, _len, _ref, _results;
          _ref = this.program;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            line = _ref[_i];
            _results.push(line.length);
          }
          return _results;
        }).call(this)),
        y: this.program.length
      };
      if (this.size.x === 0 || this.size.y === 0) {
        throw "Empty program!";
      }
      this.point = {
        x: 0,
        y: 0
      };
      this.stack = [];
      this.direction = Direction.Right;
      this.state = State.Run;
      _ref = this.program;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        k = this.size.x - line.length;
        line.length = this.size.x;
        for (i = _j = _ref1 = this.size.x - k, _ref2 = this.size.x; _ref1 <= _ref2 ? _j < _ref2 : _j > _ref2; i = _ref1 <= _ref2 ? ++_j : --_j) {
          line[i] = " ";
        }
      }
    }

    Befunge.prototype.execute = function(step) {
      var i, _i, _results;
      if (step == null) {
        step = Number.MAX_VALUE;
      }
      _results = [];
      for (i = _i = 0; 0 <= step ? _i <= step : _i >= step; i = 0 <= step ? ++_i : --_i) {
        if (this.doStep()) {
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Befunge.prototype.push = function(n) {
      this.stack.push(n);
      return this.delegate.pushStack(n);
    };

    Befunge.prototype.pop = function() {
      if (this.stack.length === 0) {
        return 0;
      } else {
        this.delegate.popStack();
        return this.stack.pop();
      }
    };

    Befunge.prototype.movePoint = function() {
      switch (this.direction) {
        case Direction.Left:
          this.point.x -= 1;
          if (this.point.x < 0) {
            return this.point.x = this.size.x - 1;
          }
          break;
        case Direction.Right:
          this.point.x += 1;
          if (this.point.x >= this.size.x) {
            return this.point.x = 0;
          }
          break;
        case Direction.Up:
          this.point.y -= 1;
          if (this.point.y < 0) {
            return this.point.y = this.size.y - 1;
          }
          break;
        case Direction.Down:
          this.point.y += 1;
          if (this.point.y >= this.size.y) {
            return this.point.y = 0;
          }
      }
    };

    Befunge.prototype.doStep = function() {
      var c;
      c = this.program[this.point.y][this.point.x];
      switch (this.state) {
        case State.Read:
          if (c === '"') {
            this.state = State.Run;
          } else {
            this.push(c.charCodeAt(0));
          }
          return this.movePoint();
        case State.Run:
          return this.doCommand(c);
      }
    };

    Befunge.prototype.doCommand = function(c) {
      var a, b, from, n, num, to, x, y;
      switch (c) {
        case "<":
          this.direction = Direction.Left;
          break;
        case ">":
          this.direction = Direction.Right;
          break;
        case "^":
          this.direction = Direction.Up;
          break;
        case "v":
          this.direction = Direction.Down;
          break;
        case "_":
          this.direction = this.pop() === 0 ? Direction.Right : Direction.Left;
          break;
        case "|":
          this.direction = this.pop() === 0 ? Direction.Down : Direction.Up;
          break;
        case "?":
          this.direction = Math.floor(Math.random() * 4);
          break;
        case " ":
          break;
        case "#":
          this.movePoint();
          break;
        case "@":
          return true;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.push(c.charCodeAt(0) - '0'.charCodeAt(0));
          break;
        case '"':
          this.state = State.Read;
          break;
        case "&":
          n = this.delegate.getNum();
          this.push(n);
          break;
        case "~":
          c = this.delegate.getChar();
          this.push(c.charCodeAt(0));
          break;
        case ".":
          num = this.pop();
          this.delegate.putNum(num);
          break;
        case ",":
          a = this.pop();
          this.delegate.putChar(String.fromCharCode(a));
          break;
        case "+":
          a = this.pop();
          b = this.pop();
          this.push(b + a);
          break;
        case "-":
          a = this.pop();
          b = this.pop();
          this.push(b - a);
          break;
        case "*":
          a = this.pop();
          b = this.pop();
          this.push(b * a);
          break;
        case "/":
          a = this.pop();
          b = this.pop();
          this.push(Math.floor(b / a));
          break;
        case "%":
          a = this.pop();
          b = this.pop();
          this.push(b % a);
          break;
        case "`":
          a = this.pop();
          b = this.pop();
          this.push(b > a ? 1 : 0);
          break;
        case "!":
          a = this.pop();
          this.push(a === 0 ? 1 : 0);
          break;
        case ":":
          a = this.pop();
          this.push(a);
          this.push(a);
          break;
        case "\\":
          a = this.pop();
          b = this.pop();
          this.push(a);
          this.push(b);
          break;
        case "$":
          this.pop();
          break;
        case "g":
          y = this.pop();
          x = this.pop();
          c = this.program[y][x];
          this.delegate.readCode(y, x, c);
          this.push(c.charCodeAt(0));
          break;
        case "p":
          y = this.pop();
          x = this.pop();
          from = this.program[y][x];
          to = String.fromCharCode(this.pop());
          this.delegate.writeCode(y, x, from, to);
          this.program[y][x] = to;
          break;
        default:
          throw "undefined operator " + c.charCodeAt(0);
      }
      this.movePoint();
      return false;
    };

    return Befunge;

  })();

  $(function() {
    var _ref;
    $('#code').val((_ref = Examples[location.hash]) != null ? _ref : Examples["#hello"]);
    $('.example').on('click', function() {
      return $('#code').val(Examples[$(this).attr('href')]);
    });
    return $('#launch').on('click', function() {
      util.font.name = $('#font').val();
      if (util.font.name === "helvetiker") {
        util.font.weight = "bold";
      }
      new Main($('#code').val(), $('#inputchar').val(), $('#inputnumber').val(), $('#step').val());
      $('#entry').remove();
      $('#back').show();
      return false;
    });
  });

  Examples = {
    "#hello": "v @_       v\n>0\"!dlroW\"v\nv  :#     <\n>\" ,olleH\" v\n   ^       <",
    "#fizzbuzz": ">1+\".\"05pv\n,        >:3%!v\n+    v,,\"Fizz\"_v\n5    >,,\"$\"05p v\n5         v!%5:<\n.v,,\"Buzz\"_v\n:>,,\"$\"05p v\n^_@#-+\"22\":<",
    "#lifegame": "v>>31g> ::51gg:2v++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n9p BXY|-+<v3*89<%+ *                                                      *   +\n21 >98 *7^>+\\-0|<+ *                                                     *    +\n*5 ^:+ 1pg15\\,:< + *                                                     ***  +\n10^  <>$25*,51g1v+                                                            +\n-^ p<| -*46p15:+<+                                                            +\n> 31^> 151p>92*4v+                                                            +\n ^_ \".\",   ^ vp1<+                                                            +\n>v >41p      >0 v+                                                            +\n:5! vg-1g15-1g14<+                                                            +\n+1-+>+41g1-51gg+v+                                                            +\n1p-1vg+1g15-1g14<+                                                            +\ng61g>+41g51g1-g+v+                                                            +\n14*1v4+g+1g15g14<+                           * *                              +\n5>^4>1g1+51g1-g+v+                           * *                              +\n^ _^v4+gg15+1g14<+                           ***                              +\n>v! >1g1+51g1+g+v+                                                            +\ng8-v14/*25-*4*88<+                                                            +\n19+>g51gg\" \"- v  +                                                            +\n4*5  v<   v-2:_3v+                                                            +\n >^   |!-3_$  v<-+                                                            +\n^    < <      <|<+                                                         ***+\n>g51gp ^ >51gp^>v+                                                            +\n^14\"+\"<  ^g14\"!\"<++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
    "#bottles": "5:*4*1-           >:1    v\n           v.:<\n           #  |:\\<       <\n>v\"No more \"0 <          0\n,:                       :\n^_$        v             |!-1       <\n>v\"bottle\"0<      | :,*25<\n,:           >\"s\"v@\n^_$1-        |   ,\n>v\" of beer\"0<   <\n,:               >v\n^_$            :!|\n>v\" on the wall\"0<\n,:                     >\".\"v\n^_$               >:2-!|\n                       >\",\">,25*,:  |\n>v\"Take one down, pass it around,\"0$<\n,:\n^_$25*,1-      :2v",
    "#aturley": ">84*>:#v_55+\"ude.ub@yelruta\">:#,_@>188*+>\\02p\\12p\\:22p#v_$    55+,1-         v\n    ^  0 v +1\\                   _^#-+*<               >22g02g*\"_@\"*-!1- #v_v>\n       >:>::3g: ,\\188                  ^^               -1\\g21\\g22<p3\\\"_\":<\n________________________________@_________________________________^  p3\\\"@\":<"
  };

  Main = (function(_super) {
    __extends(Main, _super);

    function Main(code, inputChar, inputNumber, stepPerFrame) {
      this.update = __bind(this.update, this);
      var info, light, stackOpSpeed, torusOpSpeed, _i, _len, _ref, _ref1;
      this.inputChar = inputChar.split("");
      this.inputNumber = inputNumber.split(",");
      this.stepPerFrame = Number(stepPerFrame);
      this.count = 0;
      this.world = new World;
      this.befunge = new Befunge(code, this);
      this.root = new THREE.Object3D;
      this.world.scene.add(this.root);
      torusOpSpeed = this.stepPerFrame <= 5 ? 0.02 : this.stepPerFrame <= 100 ? 0.05 : 0.10;
      this.torus = new Torus(this.befunge.program, torusOpSpeed);
      this.torus.position.x = -50;
      this.root.add(this.torus);
      this.stack = this.stepPerFrame <= 20 ? (stackOpSpeed = this.stepPerFrame <= 5 ? 0.1 : this.stepPerFrame <= 10 ? 0.2 : 0.5, new StackDynamic(stackOpSpeed)) : new Stack;
      this.torus.add(this.stack);
      this.output = new Output(14);
      this.output.position.x = 100;
      this.output.position.y = 200;
      this.output.rotation.x = Math.PI * 0.3;
      this.output.rotation.y = -Math.PI * 0.15;
      this.root.add(this.output);
      _ref = [[0x3366ff, -500, 0, 0], [0xff6633, 0, 0, 500]];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        info = _ref[_i];
        light = new THREE.PointLight(info[0], 3, 3000);
        (_ref1 = light.position).set.apply(_ref1, info.slice(1, 4));
        this.root.add(light);
      }
      this.root.update = this.update;
    }

    Main.prototype.update = function() {
      this.count += this.stepPerFrame;
      while (this.count >= 1) {
        if (this.end) {
          return;
        }
        this.end = this.befunge.doStep();
        this.count -= 1;
      }
    };

    Main.prototype.putNum = function(n) {
      return this.output.insert("" + n + " ");
    };

    Main.prototype.putChar = function(c) {
      return this.output.insert(c);
    };

    Main.prototype.pushStack = function(n) {
      return this.stack.push(n);
    };

    Main.prototype.popStack = function() {
      return this.stack.pop();
    };

    Main.prototype.readCode = function(y, x, c) {
      return this.torus.readCode(y, x);
    };

    Main.prototype.writeCode = function(y, x, from, to) {
      return this.torus.writeCode(y, x, to);
    };

    Main.prototype.getNum = function() {
      if (this.inputNumber.length > 0) {
        return Number(this.inputNumber.shift());
      } else {
        return 0;
      }
    };

    Main.prototype.getChar = function() {
      if (this.inputChar.length > 0) {
        return this.inputChar.shift();
      } else {
        return "\n";
      }
    };

    return Main;

  })(BefungeDelegate);

  Output = (function(_super) {
    __extends(Output, _super);

    function Output(height) {
      var mesh, size;
      this.height = height;
      Output.__super__.constructor.call(this);
      this.textGeometryGen = util.textGeometryGen(this.height, 8);
      this.cursor = {
        x: 0,
        y: -this.height - 2
      };
      this.tmpMatrix = new THREE.Matrix4();
      size = 20;
      mesh = util.flatMesh(new THREE.PlaneGeometry(this.height * size, this.height * size, size, size), 0xffffff);
      mesh.material.wireframe = true;
      mesh.material.transparent = true;
      mesh.material.opacity = 0.5;
      mesh.position.x = this.height * (size / 2 - 1);
      mesh.position.y = -this.height * (size / 2 - 1);
      this.add(mesh);
      this.buf = "";
      this.currentLine = [];
      this.lines = [];
    }

    Output.prototype.newline = function() {
      var g, geo, mesh, _i, _j, _len, _len1, _ref, _ref1;
      this.cursor.x = 0;
      this.cursor.y -= this.height + 2;
      geo = new THREE.Geometry();
      _ref = this.currentLine;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        g = _ref[_i];
        geo.merge(g.geometry, g.matrix);
        this.remove(g);
      }
      mesh = util.flatMesh(geo, 0xffffff);
      this.add(mesh);
      this.lines.push(mesh);
      this.buf = "";
      this.currentLine = [];
      if (this.lines.length > 15) {
        this.cursor.y += this.height + 2;
        this.remove(this.lines.shift());
        _ref1 = this.lines;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          mesh = _ref1[_j];
          mesh.applyMatrix(this.tmpMatrix.makeTranslation(0, this.height + 2, 0));
        }
      }
      return null;
    };

    Output.prototype.insert = function(text) {
      var geo, i, line, mesh, _i, _len, _ref;
      _ref = text.split("\n");
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        line = _ref[i];
        if (i !== 0) {
          this.newline();
        }
        if (line === "") {
          continue;
        }
        if (/^ +$/.test(line)) {
          this.buf += line;
          continue;
        }
        geo = this.textGeometryGen(this.buf + line);
        this.buf = "";
        mesh = util.flatMesh(geo, 0xffffff);
        mesh.applyMatrix(this.tmpMatrix.makeTranslation(this.cursor.x, this.cursor.y, 0));
        this.add(mesh);
        this.currentLine.push(mesh);
        geo.computeBoundingBox();
        this.cursor.x += geo.boundingBox.max.x + 1;
      }
      return null;
    };

    return Output;

  })(THREE.Object3D);

  Stack = (function(_super) {
    __extends(Stack, _super);

    function Stack() {
      Stack.__super__.constructor.call(this);
      this.span = 30;
      this.textFactory = util.textFactoryGen(20, 10, true);
      this.pool = new THREE.Object3D;
      this.add(this.pool);
      this.list = [];
    }

    Stack.prototype.push = function(n) {
      var mesh;
      mesh = this.textFactory.make(String(n));
      mesh.position.set(0, 0, this.list.length * this.span);
      this.pool.add(mesh);
      this.list.push(mesh);
      return mesh;
    };

    Stack.prototype.pop = function() {
      var mesh;
      mesh = this.list.pop();
      this.textFactory.dispose(mesh);
      return this.pool.remove(mesh);
    };

    Stack.prototype.update = function() {
      return this.pool.position.z = -this.span * (this.list.length - 1) / 2;
    };

    return Stack;

  })(THREE.Object3D);

  StackDynamic = (function(_super) {
    __extends(StackDynamic, _super);

    function StackDynamic(opSpeed) {
      this.opSpeed = opSpeed;
      StackDynamic.__super__.constructor.call(this);
      this.speed = 15;
      this.stSpeed = 5;
    }

    StackDynamic.prototype.update = function() {
      var to;
      if (this.list.length === 0) {
        this.pool.position.z = 0;
        return;
      }
      to = -this.span * (this.list.length - 1) / 2;
      return this.pool.position.z = Math.abs(this.pool.position.z - to) < this.stSpeed ? to : this.pool.position.z < to ? this.pool.position.z + this.stSpeed : this.pool.position.z - this.stSpeed;
    };

    StackDynamic.prototype.push = function(n) {
      var mesh;
      mesh = StackDynamic.__super__.push.call(this, n);
      mesh.material.transparent = true;
      mesh.material.opacity = 0;
      mesh.position.z += this.speed / this.opSpeed;
      return mesh.update = (function(_this) {
        return function() {
          if (mesh.material.opacity >= 1) {
            delete mesh.update;
          }
          mesh.material.opacity += _this.opSpeed;
          return mesh.position.z -= _this.speed;
        };
      })(this);
    };

    StackDynamic.prototype.pop = function() {
      var count, limit, mesh, r, vec;
      mesh = this.list.pop();
      r = Math.random() * Math.PI * 2;
      vec = new THREE.Vector3(Math.cos(r) * this.speed, Math.sin(r) * this.speed, 0);
      limit = this.span / this.speed * 1.5;
      count = 0;
      return mesh.update = (function(_this) {
        return function() {
          if (count === 0 && mesh.material.opacity < 1) {
            mesh.material.opacity += _this.opSpeed;
            mesh.position.z -= _this.speed;
            return;
          }
          count += 1;
          if (count <= limit) {
            mesh.position.add(vec);
          } else {
            mesh.position.z -= _this.speed;
          }
          mesh.material.opacity -= _this.opSpeed;
          if (mesh.material.opacity <= 0) {
            delete mesh.update;
            _this.textFactory.dispose(mesh);
            return _this.pool.remove(mesh);
          }
        };
      })(this);
    };

    return StackDynamic;

  })(Stack);

  Torus = (function(_super) {
    __extends(Torus, _super);

    function Torus(program, opSpeed) {
      var fontSize, rotateSpeed, wheel, x, xrate, y;
      this.opSpeed = opSpeed;
      Torus.__super__.constructor.call(this);
      this.size = {
        x: program[0].length,
        y: program.length
      };
      this.r1 = Math.max(16, this.size.y) * 2.7;
      this.r2 = Math.max(40, this.size.x) * 1.7 + this.r1;
      fontSize = Math.max(160 / Math.max(this.size.x * 0.3, this.size.y), 16);
      this.textFactory = util.textFactoryGen(fontSize, 8, true);
      rotateSpeed = Math.PI * 0.001;
      (function(_this) {
        return (function() {
          var offset, tube, wireframe;
          tube = _this.r1 - 15;
          offset = Math.PI * 2 / _this.size.y;
          wireframe = util.flatMesh(new THREE.TorusGeometry(_this.r2, tube, _this.size.y, _this.size.x), 0xffffff);
          wireframe.material.wireframe = true;
          wireframe.material.opacity = 0.3;
          wireframe.material.transparent = true;
          _this.add(wireframe);
          wireframe.geometry.dynamic = true;
          return wireframe.update = function() {
            var i, idx, j, u, v, _i, _j, _ref, _ref1;
            if (rotateSpeed === 0) {
              delete wireframe.update;
            }
            offset -= rotateSpeed;
            for (j = _i = 0, _ref = _this.size.y; 0 <= _ref ? _i <= _ref : _i >= _ref; j = 0 <= _ref ? ++_i : --_i) {
              for (i = _j = 0, _ref1 = _this.size.x; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
                u = i / _this.size.x * Math.PI * 2;
                v = j / _this.size.y * Math.PI * 2 + offset;
                idx = j * (_this.size.x + 1) + i;
                wireframe.geometry.vertices[idx].x = (_this.r2 + tube * Math.cos(v)) * Math.cos(u);
                wireframe.geometry.vertices[idx].y = (_this.r2 + tube * Math.cos(v)) * Math.sin(u);
                wireframe.geometry.vertices[idx].z = tube * Math.sin(v);
              }
            }
            return wireframe.geometry.verticesNeedUpdate = true;
          };
        });
      })(this)();
      this.wheels = (function() {
        var _i, _ref, _results;
        _results = [];
        for (x = _i = 0, _ref = this.size.x; 0 <= _ref ? _i < _ref : _i > _ref; x = 0 <= _ref ? ++_i : --_i) {
          xrate = Math.PI * 2 * x / this.size.x;
          wheel = new Wheel(rotateSpeed);
          wheel.position.set(Math.cos(xrate) * this.r2, Math.sin(xrate) * this.r2, 0);
          wheel.rotation.z = xrate;
          this.add(wheel);
          wheel.ls = (function() {
            var _j, _ref1, _results1;
            _results1 = [];
            for (y = _j = 0, _ref1 = this.size.y; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
              if (program[y][x] === " ") {
                _results1.push(null);
              } else {
                _results1.push(this.makeCell(program[y][x], y, 0, wheel));
              }
            }
            return _results1;
          }).call(this);
          _results.push(wheel);
        }
        return _results;
      }).call(this);
    }

    Torus.prototype.update = function() {
      this.rotation.x += 0.003;
      return this.rotation.y += 0.003;
    };

    Torus.prototype.makeCell = function(text, y, offset, wheel) {
      var cell;
      cell = this.textFactory.make(text);
      cell.material.transparent = true;
      cell.offset_ = offset;
      cell.y_ = y;
      this.updateCell(cell);
      wheel.makeDynamic();
      wheel.payload.add(cell);
      return cell;
    };

    Torus.prototype.updateCell = function(cell) {
      var yrate;
      yrate = Math.PI * 2 * cell.y_ / this.size.y;
      cell.position.set(Math.sin(yrate) * (this.r1 - cell.offset_), 0, Math.cos(yrate) * (this.r1 - cell.offset_));
      cell.rotation.y = yrate;
      return cell.rotation.z = Math.PI / 2;
    };

    Torus.prototype.removeCell = function(cell, wheel) {
      this.textFactory.dispose(cell);
      wheel.makeDynamic();
      return wheel.payload.remove(cell);
    };

    Torus.prototype.readCode = function(y, x) {};

    Torus.prototype.writeCode = function(y, x, to) {
      var obj, speed, tmp, wheel;
      speed = 3;
      wheel = this.wheels[x];
      if (wheel.ls[y] != null) {
        wheel.beginAnimation();
        obj = wheel.ls[y];
        obj.update = (function(_this) {
          return function() {
            obj.material.opacity -= _this.opSpeed;
            obj.offset_ -= speed;
            _this.updateCell(obj);
            if (obj.material.opacity <= 0) {
              _this.removeCell(obj, wheel);
              delete obj.update;
              return wheel.endAnimation();
            }
          };
        })(this);
      }
      wheel.ls[y] = to === " " ? null : this.makeCell(to, y, speed / this.opSpeed, wheel);
      if (wheel.ls[y] != null) {
        wheel.beginAnimation();
        tmp = wheel.ls[y];
        tmp.material.opacity = 0;
        return tmp.update = (function(_this) {
          return function() {
            tmp.material.opacity += _this.opSpeed;
            tmp.offset_ -= speed;
            _this.updateCell(tmp);
            if (tmp.material.opacity >= 1) {
              tmp.material.opacity = 1;
              delete tmp.update;
              return wheel.endAnimation();
            }
          };
        })(this);
      }
    };

    return Torus;

  })(THREE.Object3D);

  Wheel = (function(_super) {
    __extends(Wheel, _super);

    function Wheel(rotateSpeed) {
      this.rotateSpeed = rotateSpeed;
      Wheel.__super__.constructor.call(this);
      this.payload = new THREE.Object3D();
      this.add(this.payload);
      this.stash = null;
      this.currentRotation = 0;
      this.moving = 0;
    }

    Wheel.prototype.beginAnimation = function() {
      this.moving += 1;
      return this.makeDynamic();
    };

    Wheel.prototype.endAnimation = function() {
      return this.moving -= 1;
    };

    Wheel.prototype.makeDynamic = function() {
      if (!this.stash) {
        return;
      }
      this.remove(this.payload);
      this.payload = this.stash;
      this.stash = null;
      return this.add(this.payload);
    };

    Wheel.prototype.makeStatic = function() {
      var g, geo, _i, _len, _ref;
      if (this.stash) {
        return;
      }
      this.remove(this.payload);
      this.stash = this.payload;
      geo = new THREE.Geometry();
      _ref = this.stash.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        g = _ref[_i];
        g.matrixAutoUpdate && g.updateMatrix();
        geo.merge(g.geometry, g.matrix);
      }
      this.payload = util.flatMesh(geo, 0xffffff);
      return this.add(this.payload);
    };

    Wheel.prototype.update = function() {
      if (this.moving === 0) {
        this.makeStatic();
      }
      this.currentRotation += this.rotateSpeed;
      return this.payload.rotation.y = this.currentRotation;
    };

    return Wheel;

  })(THREE.Object3D);

  util = {
    flatMesh: function(geometry, color) {
      if (color == null) {
        color = 0xffffff;
      }
      return new THREE.Mesh(geometry, util.flatMaterial(color));
    },
    basicMesh: function(geometry, color) {
      if (color == null) {
        color = 0xffffff;
      }
      return new THREE.Mesh(geometry, util.basicMaterial(color));
    },
    flatMaterial: function(color) {
      if (color == null) {
        color = 0xffffff;
      }
      return new THREE.MeshPhongMaterial({
        color: color,
        shading: THREE.FlatShading
      });
    },
    basicMaterial: function(color) {
      if (color == null) {
        color = 0xffffff;
      }
      return new THREE.MeshBasicMaterial({
        color: color
      });
    },
    font: {
      name: "",
      weight: "normal",
      style: "normal"
    },
    textGeometryGen: function(size, height, centering) {
      var cache, options;
      if (centering == null) {
        centering = false;
      }
      cache = {};
      options = {
        font: util.font.name,
        weight: util.font.weight,
        style: util.font.style,
        size: size,
        height: height,
        curveSegments: 4
      };
      return function(text) {
        var a, offsets, ret, _ref;
        if (cache[text] != null) {
          return cache[text];
        }
        cache[text] = ret = new THREE.TextGeometry(text, options);
        if (centering) {
          ret.computeBoundingBox();
          offsets = (function() {
            var _i, _len, _ref, _results;
            _ref = ["x", "y", "z"];
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              a = _ref[_i];
              _results.push(-0.5 * (ret.boundingBox.max[a] - ret.boundingBox.min[a]));
            }
            return _results;
          })();
          ret.applyMatrix((_ref = new THREE.Matrix4()).makeTranslation.apply(_ref, offsets));
        }
        return ret;
      };
    },
    factoryGen: function(maker) {
      var cache;
      cache = {};
      return {
        make: function(key) {
          var ret, _ref;
          if (((_ref = cache[key]) != null ? _ref.length : void 0) > 0) {
            return cache[key].shift();
          } else {
            ret = maker(key);
            ret.key_ = key;
            return ret;
          }
        },
        dispose: function(m) {
          var _name;
          if (cache[_name = m.key_] == null) {
            cache[_name] = [];
          }
          return cache[m.key_].push(m);
        }
      };
    },
    textFactoryGen: function() {
      var geometryGen, opts;
      opts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      geometryGen = util.textGeometryGen.apply(util, opts);
      return util.factoryGen(function(text) {
        return util.flatMesh(geometryGen(text), 0xffffff);
      });
    }
  };

  THREE.Object3D.prototype.update = function() {};

  THREE.Object3D.prototype.visit = function() {
    var child, _i, _len, _ref, _results;
    this.update();
    _ref = this.children;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      _results.push(child != null ? child.visit() : void 0);
    }
    return _results;
  };

  THREE.Object3D.prototype.removeAll = function() {
    var child, _i, _len, _ref, _results;
    _ref = this.children.slice();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      _results.push(this.remove(child != null));
    }
    return _results;
  };

  World = (function() {
    function World() {
      this.onWindowResize = __bind(this.onWindowResize, this);
      this.animate = __bind(this.animate, this);
      var container;
      container = document.createElement('div');
      document.body.appendChild(container);
      this.camera = new THREE.PerspectiveCamera(45, 1.0, 1, 1000);
      this.camera.position.y = -400;
      this.camera.position.z = 300;
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      this.scene = new THREE.Scene;
      this.scene.fog = new THREE.FogExp2(0x000000, 0.002);
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setClearColor(this.scene.fog.color, 1);
      this.renderer.autoClear = false;
      container.appendChild(this.renderer.domElement);
      this.passes = {
        render: new THREE.RenderPass(this.scene, this.camera),
        fxaa: new THREE.ShaderPass(THREE.FXAAShader),
        bloom: new THREE.BloomPass(1.5),
        copy: new THREE.ShaderPass(THREE.CopyShader)
      };
      this.passes.copy.renderToScreen = true;
      this.composer = new THREE.EffectComposer(this.renderer);
      this.composer.addPass(this.passes.render);
      this.composer.addPass(this.passes.fxaa);
      this.composer.addPass(this.passes.bloom);
      this.composer.addPass(this.passes.copy);
      window.addEventListener('resize', this.onWindowResize);
      this.onWindowResize();
      this.animate();
    }

    World.prototype.animate = function(timestamp) {
      var _ref;
      this.delta = timestamp - ((_ref = this.prevTimestamp) != null ? _ref : timestamp);
      this.prevTimestamp = timestamp;
      requestAnimationFrame(this.animate);
      this.scene.visit();
      return this.render();
    };

    World.prototype.render = function() {
      this.renderer.clear();
      return this.composer.render(0.05);
    };

    World.prototype.onWindowResize = function() {
      this.windowHalf = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      };
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.passes.fxaa.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
      return this.composer.reset();
    };

    return World;

  })();

}).call(this);
