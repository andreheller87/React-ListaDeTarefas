
import './App.css';
import {useState, useEffect} from 'react';
import {BsTrash,BsBookmarkCheck,BsBookmarkCheckFill} from 'react-icons/bs'

const API = "http://localhost:5000";

function App() {
  const [title,setTitle] = useState("");
  const [time, setTime] = useState("");

  const [todos,setTodos] = useState([]);
  const [loading , setLoading] = useState(false);

  useEffect(()=>{

    const loadData= async() =>{
      setLoading(true)
      const res = await fetch(API + "/todos").then((res)=> res.json()).then((data) =>data).catch((err) => console.log(err));
      setLoading(false);
      setTodos(res);
    } ;
      loadData();
  },[])

  const handleSubmit =  async(e)=>{
    e.preventDefault()
  
    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    await fetch(API + "/todos",{
      method: "POST",
      body:JSON.stringify(todo),
      headers:{
        "Content-Type": "application/json"
      },
    })

    setTodos((prevState) =>[...prevState, todo])
    console.log(todo);
    setTitle("");
    setTime("");
  };

  const handleDelete = async (id)=>{
    await fetch(API + "/todos/" + id,{
      method: "DELETE",
    });

    setTodos((prevState)=> prevState.filter((todo)=> todo.id !== id)); 
  }

  const handleEdit = async (todo) => {
    todo.done = !todo.done;
    const data =await fetch(API + "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    setTodos((prevState) => prevState.map((t) => (t.id === data.id) ? (t =data):t));
  };
  

  if(loading){
    return <p>Carregando...</p>
  }


  return (
    <section className="App">
      <header className='header'>
          <h1>Task Schedule</h1>
      </header>
      <section className='form-todo'>
          <p>Insira sua nova tarefa:</p>
          <form onSubmit={handleSubmit}>
            <section className='form-control'>
              <label htmlFor="title">O que você vai fazer?</label>
              <input type='text' name='title' placeholder='Titulo da tarefa' onChange={(e) => setTitle(e.target.value)} value={title || ""} required></input>
            </section>
            <section className='form-control'>
              <label htmlFor="time">Duração:</label>
              <input type='text' name='time' placeholder='tempo estimado(Em horas)' onChange={(e) => setTime(e.target.value)} value={time || ""} required></input>
            </section>

          <input type='submit' value={"Criar Tarefa"}/>

          </form>
      </section>
      <section className='list-todo'>
      <h2>Lista de tarefas:</h2>
      {todos.length === 0 && <p>Não há tarefas!</p>}
       {todos.map((todo) => (
        <section key={todo.id} className='todo'>
          <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time}</p>
            <section>
              <span onClick={()=> handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck/>:<BsBookmarkCheckFill/>}
              </span>
              <BsTrash onClick={()=>handleDelete(todo.id)}/>
            </section>
        </section>
     
  ))}
 </section>
  </section>
  );
}

export default App;
