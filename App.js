import React, {useState, useCallback, useEffect} from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, TouchableOpacity, FlatList, Modal, TextInput, AsyncStorage} from 'react-native';
import {Ionicons} from "@expo/vector-icons"
import TaskList from './src/components/TaskList';
import * as Animatable from "react-native-animatable"

const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity)

export default function App() {
  const [task, setTask] = useState([]);
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")

  /* BUSCANDO TODAS TAREFAS AO INICIAR O APP */
  useEffect(()=>{
    async function loadTasks(){
      const taskStorage = await AsyncStorage.getItem("@task");

      if(taskStorage){
        setTask(JSON.parse(taskStorage))
      }
    }

    loadTasks();

  },[])

  /* SALVANDO CASO TENHA ALGUMA TAREGA ALTERADA */
  useEffect(()=>{
    async function saveTasks(){
      await AsyncStorage.setItem("@task", JSON.stringify(task))
    }

    saveTasks();

  },[task])


  function handleAdd(){
    if(input === "") return; /* SE NAO TIVER NADA NO INPUT ELE NAO ADD */

    const data={
      key:input,
      task:input
    };

    setTask([...task,data]); /* PEGA TODAS AS TASK (...TASK) E ADD A NOVA QUE ESTA NO DATA */
    setOpen(false); /* PARA FECHAR O MODAL QUANDO ADD NOVA TAREFA */
    setInput(""); /* PARA LIMPAR O INPUT APOS ADD NOVA TAREFA */
  }

  const handleDelete = useCallback((data)=>{
    const find = task.filter(resultado => resultado.key !== data.key);
    setTask(find)
  })

  return (
    <SafeAreaView style={styles.container} >
      <StatusBar backgroundColor="#171d31" barStyle="light-content" />

      <View style={styles.content}>
        <Text style={styles.title}>Minhas Tarefas</Text>
      </View>

      <FlatList
        marginHorizontal={10} /* DESCOLAR A LISTA DO CANTO ESQUERDO DA TELA */
        showsHorizontalScrollIndicator={false}
        data={task}
        keyExtractor={(item) => String(item.key)}
        renderItem={({item})=> <TaskList data={item} handleDelete={handleDelete} />} 
      />

      <Modal animationType="slide" trasparent={false} visible={open}>
        <SafeAreaView style={styles.modal}>

          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={()=> setOpen(false)}>
              <Ionicons style={{marginLeft:5, marginRight:5}} name="md-arrow-back" size={40} color="#FFF"  />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nova Tarefa</Text>
          </View>

          <Animatable.View style={styles.modalBody} animation="fadeInUp" useNativeDriver>
            <TextInput 
             multiline={true} /* PARA O TEXTO NAO PASSAR DO INPUT/QUEBRAR LINHA */
             placeholderTextColor="#747474"
             autoCorrect={false} /* PARA DESABILITAR O CORRETOR DO USUARIO */
             placeholder="Digite uma tarefa!"
             style={styles.input} 
             value={input}
             onChangeText={(texto)=> setInput(texto)}
            />

            <TouchableOpacity style={styles.handleAdd} onPress={handleAdd}>
              <Text style={styles.handleAddText}> Cadastrar </Text>
            </TouchableOpacity>

          </Animatable.View>
           
        </SafeAreaView>
      </Modal>

      <AnimatedBtn 
          style={styles.fab} 
          useNativeDriver 
          animation="bounceInUp" 
          duration={1500}
          onPress={()=> setOpen(true)}
          >
        <Ionicons name="ios-add" size={35} color="#FFF" />
      </AnimatedBtn>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
   container:{
      flex:1, /* PARA USAR A TELA TODA */
      backgroundColor: "#171d31"
   },
   content:{},
   title:{
    marginTop:10,
    paddingBottom:10,
    fontSize:35,
    textAlign:"center",
    color:"#FFF"
   },
   fab:{
    position:"absolute",
    width:60,
    height:60,
    backgroundColor:"#0094FF",
    alignItems:"center",
    justifyContent:"center",
    borderRadius:30,
    right:25,
    bottom:25,
    elevation:2, /* PARA DAR UMA SOMBRA NO BOTAO */
    zIndex:9, /* PARA SOBREPOR CASO TENHA MUITAS TAREFAS NA TELA */
    shadowColor:"#000",
    shadowOpacity:0.2,
    shadowOffset:{
      width:1,
      height:3,
    }
   },
   modal:{
    flex:1,
    backgroundColor:"#171d31",
   },
   modalHeader:{
    marginLeft:10,
    marginTop:20,
    flexDirection:"row",
    alignItems:"center",
   },
   modalTitle:{
    color:"#FFF",
    marginLeft:15,
    fontSize:23,
   },
   modalBody:{
    marginTop:15,
   },
   input:{
    fontSize:15,
    marginLeft:10,
    marginRight:10,
    marginTop:30,
    backgroundColor:"#FFF",
    padding:9,
    height:85,
    textAlignVertical:"top",
    color:"#000",
    borderRadius:5,
   },
   handleAdd:{
    backgroundColor:"#FFF",
    marginTop:10,
    alignItems:"center",
    justifyContent:"center",
    marginLeft:10,
    marginRight:10,
    height:40,
    borderRadius:5,
   },
   handleAddText:{
    fontSize:20
   }
})
