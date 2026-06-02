import axios from "axios";

export const fetchPostalCodeData = async (pincode) => {
  if (!pincode || pincode.length !== 6) {
    throw new Error("Invalid pincode length");
  }

  // Use standard axios instead of custom api to avoid sending credentials
  const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);

  const data = response.data;

  if (!data || data[0]?.Status !== "Success") {
    throw new Error("Invalid pincode or data not found");
  }

  return data[0].PostOffice;
};

