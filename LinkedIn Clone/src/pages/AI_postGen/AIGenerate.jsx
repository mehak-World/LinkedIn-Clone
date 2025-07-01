import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainNav from "../../components/MainNav";
import parse from "html-react-parser";

const AIGenerate = () => {
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleGenerate = async () => {
    if(!user) return;
    if (!keywords.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/posts/ai/create", {
        keywords,
      });
      console.log("Generate post: ", res.data);
      setGeneratedPost(res.data);
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    // Save to db
    if (user) {
      const res = await axios.post("http://localhost:3000/posts/save", {
        content: generatedPost.content,
        image_url: generatedPost.image_url,
        public_id: generatedPost.public_id,
        user_id: user?._id,
      });
      console.log(res);
      navigate("/feed");
    }
  };

  return (
    <>
      <MainNav />
      <div className="max-w-xl mx-auto p-4 my-[5%]">
        <h2 className="text-2xl font-bold mb-4">
          Generate Linkify Post with AI
        </h2>
        <input
          type="text"
          placeholder="Enter keywords (e.g., Java, DevOps)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-3"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {generatedPost && (
          <div className="mt-6 p-4 border border-gray-200 rounded shadow">
            {/* <h3 className="text-xl font-semibold mb-2">{generatedPost.title}</h3> */}
            <p className="mb-4">{parse(generatedPost.content)}</p>
            {generatedPost.image_url && (
              <img
                src={generatedPost.image_url}
                alt="Generated Visual"
                className="w-full rounded mb-4"
              />
            )}
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={handleGenerate}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Regenerate
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AIGenerate;
