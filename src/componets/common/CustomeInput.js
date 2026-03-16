import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from "../../constants/colors";

const CustomInput = ({iconName, placeholder, isPassword, rightIcons,...props}) =>{
   return(
    <View style={StyleSheet.container}>
      <Icons name={iconName} size={20} color={COLORS.darkGrey} style={StyleSheet.icon}/>
      <TextInput
         style={StyleSheet.input}
         placeholder={placeholder}
         secureTextEntry={isPassword}
         placeholderTextColor={COLORS.placeholder}
         {...props}
         />
         {rightIcons && <Icons name={rightIcons} size={20} color={COLORS.darkGrey}/>}
    </View>
   );
};

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.grey,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginVertical: 10,
        height: 55,
    },
    icon:{marginRight: 10},
    input:{flex: 1, color:COLORS.black, frontSize: 16},
});

export default CustomInput;
