document.addEventListener('DOMContentLoaded', () => {
  // A simple numerical integration using the midpoint rule
  // Integrates func from a to b in `steps` steps.
  function numericIntegration(func, a, b, steps = 1000) {
    if (a === b) return 0; // same limits => 0
    const stepSize = (b - a) / steps;
    let area = 0;
    let xCurrent = a;
    for (let i = 0; i < steps; i++) {
      const xMid = xCurrent + stepSize / 2;
      const yMid = func(xMid);
      area += yMid * stepSize;
      xCurrent += stepSize;
    }
    return area;
  }

  const toggleTools = (tool) => {
    const calcForm = document.getElementById('calcForm');
    const graphForm = document.getElementById('graphForm');
    const passwordForm = document.getElementById('passwordForm');
    const toolSelector = document.getElementById('toolSelector');
    const toolDescription = document.getElementById('toolDescription');

    // Hide all forms first
    calcForm.classList.remove('show');
    calcForm.style.display = 'none';
    graphForm.classList.remove('show');
    graphForm.style.display = 'none';
    passwordForm.classList.remove('show');
    passwordForm.style.display = 'none';

    // Show or hide the home selector
    toolSelector.style.display = tool === 'home' ? 'flex' : 'none';
    toolDescription.style.display = tool === 'home' ? 'block' : 'none';

    // Then selectively show the targeted form with a fade/transition
    if (tool === 'calc') {
      calcForm.style.display = 'flex';
      setTimeout(() => calcForm.classList.add('show'), 50);
    } else if (tool === 'graph') {
      graphForm.style.display = 'flex';
      setTimeout(() => graphForm.classList.add('show'), 50);
    } else if (tool === 'password') {
      passwordForm.style.display = 'flex';
      setTimeout(() => passwordForm.classList.add('show'), 50);
    }
  };

  // Navigation
  document.getElementById('calcWindow').addEventListener('click', () => toggleTools('calc'));
  document.getElementById('graphWindow').addEventListener('click', () => toggleTools('graph'));
  document.getElementById('passwordWindow').addEventListener('click', () => toggleTools('password'));
  document.getElementById('backButton').addEventListener('click', () => toggleTools('home'));
  document.getElementById('backButtonGraph').addEventListener('click', () => toggleTools('home'));
  document.getElementById('backButtonPassword').addEventListener('click', () => toggleTools('home'));

  // Calculator
  document.getElementById('calcForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const operation = document.getElementById('operation').value;
    const func = document.getElementById('functionSelect').value;
    const x = parseFloat(document.getElementById('xInput').value);

    const resultDiv = document.getElementById('result');
    const stepsDiv = document.getElementById('steps');

    if (isNaN(x)) {
      resultDiv.textContent = "Error: Please enter a valid number for x.";
      stepsDiv.innerHTML = "";
      return;
    }

    try {
      if (operation === "derivative") {
        const derivative = math.derivative(func, 'x');
        const resultValue = derivative.evaluate({ x });
        resultDiv.textContent = `Derivative of ${func} at x = ${x}: ${resultValue}`;
        stepsDiv.innerHTML = `<strong>Steps:</strong><br>Derivative: ${derivative.toString()}`;
      } else if (operation === "integral") {
        // We do a definite integral from 0 to x using numeric integration
        const lowerLimit = 0;
        const integralFunc = (val) => math.evaluate(func, { x: val });
        const resultValue = numericIntegration(integralFunc, lowerLimit, x);

        resultDiv.textContent = `Integral of ${func} from ${lowerLimit} to ${x}: ${resultValue}`;
        stepsDiv.innerHTML = `<strong>Steps:</strong><br>Numerical Integration (midpoint rule).`;
      }
    } catch (error) {
      resultDiv.textContent = "Error: Unsupported function or input.";
      stepsDiv.innerHTML = "Please use valid functions like x^2, sin(x), etc.";
    }
  });

  // Graph Visualization
  document.getElementById('plotButton').addEventListener('click', () => {
    const func = document.getElementById('functionInput').value.trim();

    if (!func) {
      alert("Error: Please enter a valid function.");
      return;
    }

    try {
      const xValues = Array.from({ length: 200 }, (_, i) => -10 + (i * 20) / 199);
      const yValues = xValues.map((x) => math.evaluate(func, { x }));
      
      // Note: We pass "responsive" in the config so the chart scales automatically
      Plotly.newPlot(
        'graph',
        [{
          x: xValues,
          y: yValues,
          type: 'scatter',
          mode: 'lines',
          line: { color: '#00c6ff', width: 2 }
        }],
        {
          title: `Graph of ${func}`,
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: {
            color: '#fff'
          },
          margin: { t: 60, l: 60, r: 60, b: 60 }
        },
        { responsive: true }
      );
    } catch (error) {
      alert(`Error: ${error.message}. Please use correct syntax, e.g., x^2, sin(x), etc.`);
    }
  });

  // Password Encryption
  document.getElementById('encryptButton').addEventListener('click', () => {
    const password = document.getElementById('passwordInput').value;
    const resultDiv = document.getElementById('encryptedPassword');
    if (!password) {
      resultDiv.textContent = "Please enter a password.";
      return;
    }

    const secretKey = "secret-key"; // Replace with a secure key in production
    const encrypted = CryptoJS.AES.encrypt(password, secretKey).toString();
    const encryptedBase64 = btoa(encrypted);

    resultDiv.innerHTML = `
      <strong>Encrypted Password:</strong><br>${encryptedBase64}
    `;
  });

  // Toggle password visibility
  document.getElementById('togglePassword').addEventListener('click', () => {
    const passwordInput = document.getElementById('passwordInput');
    const toggleButton = document.getElementById('togglePassword');

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleButton.textContent = 'Hide';
    } else {
      passwordInput.type = 'password';
      toggleButton.textContent = 'Show';
    }
  });
});
