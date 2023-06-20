import { useEffect, useState } from "react";

const fetchDayQuery = async () => {
  const response = await fetch("http://chiu.hopto.org:8963/charts");
  const data = await response.text();
  return data;
};

const DayQuery = () => {
  const [pageData, setPageData] = useState("");
  useEffect(() => {
    // window.location.replace("http://chiu.hopto.org:8963/charts");
    // fetchDayQuery()
    //   .then((data) => {
    //     setPageData(data);
    //   })
    //   .catch((error) => {
    //     console.log("Err");
    //     console.error(error);
    //   });
  }, []);

  //dangerouslySetInnerHTML={{ __html: pageData }}
  return (
    <iframe
      style={{
        paddingTop: 40,
        paddingLeft: 40,
        border: "0",
        width: "100%",
        height: "90vh",
      }}
      src="http://chiu.hopto.org:8963/charts"
    ></iframe>
  );
};
export default DayQuery;
