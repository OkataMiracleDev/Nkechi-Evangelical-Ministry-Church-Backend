const express = require("express");
const cors = require('cors');
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();

const allowedOrigins = ['https://nkechi-evangelical-ministry.netlify.app'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow curl/postman/no-origin requests

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.options('*', cors()); // enable preflight requests

app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const { error } = await supabase.from("subscribe").insert([{ email }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: "Subscription successful!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

console.log("Supabase URL:", process.env.SUPABASE_URL);
console.log("Supabase Key:", process.env.SUPABASE_ANON_KEY);
