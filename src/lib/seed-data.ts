import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB_NAME!;

const initialData = {
  interns: [
    { id: 1, name: "Alice Johnson", email: "alice.j@example.com", project: "AI Chatbot Integration", mentor: "Dr. Guide", status: "Active", ppoStatus: "Pending" },
    { id: 2, name: "Bob Williams", email: "bob.w@example.com", project: "Data Analytics Dashboard", mentor: "Jane Doe", status: "Active", ppoStatus: "Pending" },
    { id: 3, name: "Charlie Brown", email: "charlie.b@example.com", project: "Mobile App Redesign", mentor: "John Smith", status: "Completed", assessmentScore: 92, ppoStatus: "Recommended", ppoReasoning: "Exceeded all project goals and was a great team player." },
    { id: 4, name: "Diana Miller", email: "diana.m@example.com", project: "UI/UX Improvement", mentor: "Emily White", status: "Active", ppoStatus: "Pending" },
    { id: 5, name: "Ethan Davis", email: "ethan.d@example.com", project: "Cloud Migration Strategy", mentor: "Michael Green", status: "On-Hold", ppoStatus: "Not Recommended", ppoReasoning: "Project was put on hold, insufficient data to make a recommendation." },
    { id: 6, name: "Fiona Garcia", email: "fiona.g@example.com", project: "AI Chatbot Integration", mentor: "Dr. Guide", status: "Active", ppoStatus: "Pending" },
    { id: 7, name: "George Rodriguez", email: "george.r@example.com", project: "Data Analytics Dashboard", mentor: "Jane Doe", status: "Active", ppoStatus: "Pending" },
    { id: 8, name: "Hannah Martinez", email: "hannah.m@example.com", project: "Mobile App Redesign", mentor: "John Smith", status: "Completed", assessmentScore: 85, ppoStatus: "Recommended", ppoReasoning: "Consistently delivered high-quality work and showed great potential." },
    { id: 9, name: "Ian Hernandez", email: "ian.h@example.com", project: "UI/UX Improvement", mentor: "Emily White", status: "Active", ppoStatus: "Pending" },
    { id: 10, name: "Jasmine Lopez", email: "jasmine.l@example.com", project: "Cloud Migration Strategy", mentor: "Michael Green", status: "Active", ppoStatus: "Pending" },
    { id: 11, name: "Ken Adams", email: "ken.a@example.com", project: "E-commerce Platform", mentor: "Sarah Black", status: "Active", ppoStatus: "Pending" },
    { id: 12, name: "Laura Hill", email: "laura.h@example.com", project: "Internal Tooling", mentor: "David King", status: "Active", ppoStatus: "Pending" },
  ],
  mentors: [
    { id: 1, name: "Dr. Guide", email: "mentor@synergy.com", expertise: "AI/ML", interns: 2, avatar: "https://placehold.co/100x100.png" },
    { id: 2, name: "Jane Doe", email: "jane.d@synergy.com", expertise: "Data Science", interns: 2, avatar: "https://placehold.co/100x100.png" },
    { id: 3, name: "John Smith", email: "john.s@synergy.com", expertise: "Mobile Development", interns: 2, avatar: "https://placehold.co/100x100.png" },
    { id: 4, name: "Emily White", email: "emily.w@synergy.com", expertise: "UI/UX Design", interns: 2, avatar: "https://placehold.co/100x100.png" },
    { id: 5, name: "Michael Green", email: "michael.g@synergy.com", expertise: "Cloud Architecture", interns: 2, avatar: "https://placehold.co/100x100.png" },
    { id: 6, name: "Sarah Black", email: "sarah.b@synergy.com", expertise: "Backend Systems", interns: 1, avatar: "https://placehold.co/100x100.png" },
    { id: 7, name: "David King", email: "david.k@synergy.com", expertise: "DevOps", interns: 1, avatar: "https://placehold.co/100x100.png" },
    { id: 8, name: "Laura Hill", email: "laura.h@synergy.com", expertise: "Product Management", interns: 0, avatar: "https://placehold.co/100x100.png" },
    { id: 9, name: "Kevin Scott", email: "kevin.s@synergy.com", expertise: "Cybersecurity", interns: 0, avatar: "https://placehold.co/100x100.png" },
    { id: 10, name: "Olivia Adams", email: "olivia.a@synergy.com", expertise: "Frontend Development", interns: 0, avatar: "https://placehold.co/100x100.png" },
  ],
  projects: [
    { id: 1, name: "AI Chatbot Integration", department: "AI/ML", status: "Ongoing" },
    { id: 2, name: "Data Analytics Dashboard", department: "Data Science", status: "Ongoing" },
    { id: 3, name: "Mobile App Redesign", department: "Mobile", status: "Completed" },
    { id: 4, name: "UI/UX Improvement", department: "Design", status: "Ongoing" },
    { id: 5, name: "Cloud Migration Strategy", department: "Cloud", status: "On-Hold" },
    { id: 6, name: "E-commerce Platform", department: "Web", status: "Ongoing" },
    { id: 7, name: "Internal Tooling", department: "Infrastructure", status: "Ongoing" },
  ],
  applications: [
    { id: 1, name: "Liam Smith", university: "Tech University", date: "2024-06-01", status: "Pending" },
    { id: 2, name: "Olivia Jones", university: "State College", date: "2024-06-02", status: "Reviewed" },
    { id: 3, name: "Noah Taylor", university: "Ivy League Institute", date: "2024-06-02", status: "Accepted" },
    { id: 4, name: "Emma Brown", university: "City University", date: "2024-06-03", status: "Rejected" },
    { id: 5, name: "Oliver Wilson", university: "Tech University", date: "2024-06-04", status: "Pending" },
    { id: 6, name: "Ava Garcia", university: "State College", date: "2024-06-05", status: "Pending" },
    { id: 7, name: "Elijah Martinez", university: "Ivy League Institute", date: "2024-06-05", status: "Reviewed" },
    { id: 8, name: "Sophia Anderson", university: "City University", date: "2024-06-06", status: "Accepted" },
    { id: 9, name: "James Thomas", university: "Tech University", date: "2024-06-07", status: "Pending" },
    { id: 10, name: "Isabella Hernandez", university: "State College", date: "2024-06-08", status: "Rejected" },
    { id: 11, name: "William Moore", university: "Metro University", date: "2024-06-09", status: "Pending" },
    { id: 12, name: "Mia Clark", university: "National University", date: "2024-06-10", status: "Pending" },
    { id: 13, name: "Benjamin Lewis", university: "Coastal University", date: "2024-06-11", status: "Reviewed" },
    { id: 14, name: "Charlotte Hall", university: "Mountain State", date: "2024-06-12", status: "Accepted" },
  ]
};

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    console.log("🚀 Connected to MongoDB");

    await db.collection("interns").deleteMany({});
    await db.collection("interns").insertMany(initialData.interns);
    console.log("✅ Interns seeded");

    await db.collection("mentors").deleteMany({});
    await db.collection("mentors").insertMany(initialData.mentors);
    console.log("✅ Mentors seeded");

    await db.collection("projects").deleteMany({});
    await db.collection("projects").insertMany(initialData.projects);
    console.log("✅ Projects seeded");

    await db.collection("applications").deleteMany({});
    await db.collection("applications").insertMany(initialData.applications);
    console.log("✅ Applications seeded");

    console.log("🎉 Seeding complete!");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await client.close();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seed();
