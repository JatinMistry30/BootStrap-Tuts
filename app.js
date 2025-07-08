const acct = " 0123f136d6bf0ecc6d4d2302d2c6954f"; 
const apiKey = "c09e81fd8bbb28aa4526c491069b479a1338c1d457a7a6c1f9fef2a97b6107c4";

async function submitForm({ name, email, message }) {
  try {
    const response = await fetch(`https://api-us.turbosteed.com/${apiKey}/contactForms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-TSA': apiKey   // 🔥 Correct usage as per TurboSteed docs
      },
      body: JSON.stringify({
        formData: {
          formName: name,
          formEmail: email,
          formMessage: message
        }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Status ${response.status}: ${err.message || JSON.stringify(err)}`);
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.error('Failed to submit form', e);
    throw e;
  }
}


document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  try {
    document.getElementById('responseMessage').textContent = 'Submitting...';
    const result = await submitForm({ name, email, message });
    console.log(result);
    document.getElementById('responseMessage').textContent = '✅ Submitted successfully!';
  } catch (err) {
    document.getElementById('responseMessage').textContent = `❌ Submission failed: ${err.message}`;
  }
});
