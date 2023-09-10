import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useEffect, useState } from "react";
import LineChart from './component/LineChart'; 
import {
  Container,
  Grid,
  TextField,
} from "@mui/material";
import axios from "axios";


Chart.register(CategoryScale);
 
export default function App() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  const [queryParams, setQueryParams] = useState({
    pageUrl: '',
    startDate: '',
    endDate:''
  });

// Function to handle changes in query parameters
  const handleQueryParamChange = (paramName, paramValue) => {
    setQueryParams({
      ...queryParams,
      [paramName]: paramValue,
    });
  };



 // Define chartData state with initial values
 const [chartData, setChartData] = useState({
  labels: [],
  datasets: [
    {
      label: "Depth Rate Percentage",
      data: [],
      backgroundColor: [
        "rgba(75,192,192,1)",
        "#ecf0f1",
        "#50AF95",
        "#f3ba2f",
        "#2a71d0"
      ],
      borderColor: "black",
      borderWidth: 2
    }
  ]
});


  useEffect(() => {
    // Make the GET request
    const apiUrl = `http://localhost:5000/depth-rate?pageUrl=${queryParams.pageUrl}&startDate=${queryParams.startDate}&endDate=${queryParams.endDate}`;

    axios.get(apiUrl) 
      .then((response) => {
        setData(response.data);
        setLoading(false); 
      })
      .catch((error) => {
        setLoading(false); 
      });
  }, [queryParams]);


// Update chartData when data is available
  useEffect(() => {
    if (data.length > 0) {
      setChartData({
        ...chartData,
        labels: data.map((el) => el.VisitDate),
        datasets: [
          {
            label: "Depth Rate Percentage ",
            data: data.map((data) => data.DepthRate),
            backgroundColor: [
              "rgba(75,192,192,1)",
              "#ecf0f1",
              "#50AF95",
              "#f3ba2f",
              "#2a71d0"
            ],
            borderColor: "black",
            borderWidth: 2
          }
        ]
      });
    }
  }, [data]);





  return (
    <Container maxWidth="md" className="App" style={{ padding: '16px' }}>
    <h2 style={{ textAlign: "center" }}>Line Chart</h2>
     <Grid container spacing={2}>
       <Grid item xs={6}>
         <TextField
           label="Start Date"
           type="date"
           value={queryParams.startDate}
           onChange={(e) => handleQueryParamChange('startDate', e.target.value)}
           InputLabelProps={{
             shrink: true,
           }}
            
         />
         <TextField
           label="End Date"
           type="date"
           value={queryParams.endDate}
           onChange={(e) => handleQueryParamChange('endDate', e.target.value)}
           InputLabelProps={{
             shrink: true,
           }}
           
         />
       </Grid>
       <Grid item xs={6}>
        <TextField
            label="Page url"
            type="text"
            fullWidth
            value={queryParams.pageUrl}
            onChange={(e) => handleQueryParamChange('pageUrl', e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            
          />
       </Grid>
     </Grid>
     {loading ? ".....Loading": (
      <LineChart chartData={chartData} />
     )}
    </Container>
  );
  } 