import BranchForm from "../../components/Form_Component";
 
export default function Editfield() {
  const mockData = {
    branchName: "Head Office",
    code: "HQ001",
    telephone: "123-456-7890",
    email: "headoffice@example.com",
    fax: "123-456",
    state: "State 1",
    district: "Good District",
    city: "Capital",
    streetAddress: "Main Street",
    wardNo: "7",
    title: "Edit Branch",
    subtitle:"Address"
  };

  const handleUpdate = (data: any) => {
    console.log("Updated branch data:", data);
  };

  return <BranchForm initialData={mockData} onSubmit={handleUpdate} />;
}
