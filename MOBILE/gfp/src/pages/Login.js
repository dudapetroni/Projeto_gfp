import {View, Text, Button} from "react-native"
import { corFundo, corTextos } from "../styles/Estilos"

export default function Login ({navigation}) {
    return(
        <View>
            <Text style={{color: "#ff4b9f", fontSize: 50, fontFamily: "Arial", justifyContent: 'center', display: 'flex'}}>Login</Text>
            <Button title="Entrar" color={'#ff5bab'}onPress={() => navigation.navigate('MenuDrawer')}/>
        </View>
    )
}