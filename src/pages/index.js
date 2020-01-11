import React,{useState} from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import ReactTable from 'react-table-6'
import 'react-table-6/react-table.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row,Col,Button} from 'reactstrap';

import { makeStyles } from '@material-ui/core/styles';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

var moment = require('moment');

const useStyles = makeStyles(theme => ({
boton:{
  backgroundColor:"antiquewhite",
  border:"solid", 
  borderRadius:"5%",
  cursor:"pointer",
   '&:hover': {
       background: "#f6ff73",
    },
},
activa:{
  backgroundColor:"#f6ff73",
  border:"solid", 
  cursor:"pointer",
  borderRadius:"5%"
}
}));


const fetchData = async (fecha,setResponse,setLoading) => {
      setLoading(true);
      try {
        const res = await fetch(`https://tqed6tih68.execute-api.us-east-1.amazonaws.com/dev?date=${fecha}`, null);
        const json = await res.json();
        setResponse(json);
        setLoading(false)
      } catch (error) {
        console.log("ERROR FETCH")
        console.log(error)
        setLoading(error);
        setLoading(false)
      }
  
};
const IndexPage = () => {
    const [fecha,setFecha]=useState(moment().format("YYYY-MM-DD"));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [personas,setPersonas]=useState(2);
    React.useEffect(() => {
    fetchData(fecha,setData,setLoading);
  }, [fecha]);
    const classes = useStyles();
    const columns = [
    {
    Header: 'Numero',
    accessor: 'numero',
    width: 100,
    filterAll: true// String-based value accessors!
      },{
    Header: 'Titulo',
    accessor: 'titulo',
    width: 300,
    filterMethod: (filter, rows) =>
                  rows.filter(x=>x.title.toLowerCase().includes(filter.value.toLowerCase())),
    filterAll: true// String-based value accessors!
    }, 
    {
    Header: 'Precio',
    accessor: 'precio',
    filterMethod: (filter, rows) =>
              rows.filter(x=>parseInt(x.price)>parseInt(filter.value)),
    filterAll: true// String-based value accessors!
      },
    {
    Header: 'Precio con IVA',
    accessor: 'precioIVA',
    filterMethod: (filter, rows) =>
              rows.filter(x=>parseInt(x.price)>parseInt(filter.value)),
    filterAll: true// String-based value accessors!
      },
    {
    Header: 'Ganancia',
    accessor: 'ganancia',
    filterMethod: (filter, rows) =>
              rows.filter(x=>parseInt(x.price)>parseInt(filter.value)),
    filterAll: true// String-based value accessors!
      },
      {
    Header: 'Link',
    accessor: 'link',
    Cell: props => <div style={{color:"blue",cursor:"pointer"}} onClick={()=>{window.open(props.value)}}>{props.value}</div>
      }]
  return(
  <Layout>
    <SEO title="Home" />
    <Row>
    <Col xs={3}><h2>Fecha</h2></Col>
    <Col xs={3}><DayPickerInput  dayPickerProps={{
            disabledDays: { before: new Date() }
          }} onDayChange={day => setFecha(day)} /></Col>
    </Row>
     <br/>
    <Row>
      <Col xs={4} onClick={()=>{setPersonas(2)}} className={(personas==2)?classes.activa:classes.boton}><h2>2 personas</h2></Col>
      <Col xs={4} onClick={()=>{setPersonas(3)}} className={(personas==3)?classes.activa:classes.boton}><h2>3 personas</h2></Col>
      <Col xs={4} onClick={()=>{setPersonas(4)}} className={(personas==4)?classes.activa:classes.boton}><h2>4 personas</h2></Col>
    </Row>
    <br/>
      {<ReactTable filterable loadingText={"Cargando..."} loading={loading} columns={columns} data={!data.find(x=>x.personas==personas)?[]:data.find(x=>x.personas==personas).
      info.map((x,i)=>({...x,numero:i+1,ganancia:Math.round(parseInt(x.precio.split("AR$").join("").split(".").join(""))*0.8),precio:parseInt(x.precio.split("AR$").join("").split(".").join("")),precioIVA:Math.round(parseInt(x.precio.split("AR$").join("").split(".").join(""))*1.21)}))} />}
      <br/>

      <br/>
   
  </Layout>
)}

export default IndexPage
