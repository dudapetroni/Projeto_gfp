import {View, Text, Button, Image, Input} from "react-native"
import Header from "../assets/headerlogin.png"
import * as Animar from 'react-native-animatable'
// import Header from "../../assets/icon.png"
import { corFundo, corTextos } from "../styles/Estilos"

export default function Login ({navigation}) {
    return(
        <View>
            <Text style={{color: "#e26990", fontSize: 35, fontFamily: "Arial", justifyContent: 'center', display: 'flex', marginTop: 25}}>Faça seu login</Text>

                <Text style={styles.label}> Email:</Text>
                <TextInput
                    placeholder="Digite um email..."
                    style={styles.inputLogin}
                    onChangeText={setEmail}
                    value={email}
                    />
                <Text style={styles.label}> Senha:</Text>
                <TextInput
                    placeholder="Digite sua senha"
                    style={styles.inputLogin}
                    secureTextEntry={true}
                    onChangeText={setSenha}
                    value={senha}
                    />
                <TouchableOpacity style={styles.botao}
                    onPress={botaoEntrar}>
                    <Text style={styles.textoBotao}> Acessar </Text>
                </TouchableOpacity>
             
            <Image source={Header} style={{width:"100%", height:100, marginTop: 50}} />
            <Button title="Entrar" color={'#ffb6d0'} onPress={() => navigation.navigate('MenuDrawer')}/>
            <Text style={{marginTop: 25, fontFamily: "Arial", color: '#515151'}}>Faça seu Log-in para ter acesso à Tela Principal</Text>
        </View>
    )
}