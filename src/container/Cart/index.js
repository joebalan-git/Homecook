import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { Color, Config } from "common_f";
import Icon from "react-native-vector-icons/Ionicons";
import { CustomButton, EmptyCart } from "component_f";
import { LoadingSpinnerOverlay } from "component_f";
import fetch from "react-native-fetch-polyfill";
import AsyncStorage from "@react-native-community/async-storage";
import { toast } from "app_f/Omni";
const { width, height } = Dimensions.get("window");

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: []
    };
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("willFocus", () => {
      this.loadCart();
    });
  }
  componentWillUnmount() {
    this.focusListener.remove();
  }

  loadCart = () => {
    AsyncStorage.getItem("token").then(token => {
      const fetchOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`
        },
        timeout: 10000
      };

      fetch(Config.getCartUrl, fetchOptions)
        .then(response => {
          if (response.status === 200) {
            response.json().then(responseJSON => {
              console.log(responseJSON);
              this.setState({ cart: responseJSON });
            });
          } else {
            response.json().then(responseJSON => {
              toast(responseJSON.message);
            });
          }
        })
        .catch(() => {
          toast("Network request failed");
        });
    });
  };

  _renderActivityIndicator() {
    return ActivityIndicator ? (
      <ActivityIndicator
        animating={true}
        color={Color.secondary}
        size={"small"}
      />
    ) : Platform.OS == "android" ? (
      <ProgressBarAndroid color={Color.secondary} styleAttr={"small"} />
    ) : (
      <ActivityIndicatorIOS
        animating={true}
        color={Color.secondary}
        size={"small"}
      />
    );
  }

  renderHeader() {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>My Cart</Text>
      </View>
    );
  }

  renderCartItem() {
    return (
      <View style={styles.recommendContainer}>
        <View style={{ flexDirection: "column" }}>
          <FlatList
            style={{ height: height * 0.57 }}
            data={this.state.cart}
            keyExtractor={item => `${item.id}`}
            renderItem={({ item, index }) => this.renderItem(item, index)}
          />
        </View>
      </View>
    );
  }

  renderItem = (item, index) => {
    return (
      <View
        style={[
          styles.shadow,
          {
            flexDirection: "row",
            backgroundColor: "#fff",
            padding: 15,
            //marginHorizontal: 20,
            marginLeft: 32,
            marginRight: 32,
            marginVertical: 6,
            borderRadius: 12
          }
        ]}
      >
        <View style={{ flex: 0.25 }}>
          <Image
            style={{ width: 65, height: 65, borderRadius: 6 }}
            source={{
              uri: `${Config.baseUrl}${item.items.image_url[0].image}`
            }}
          />
        </View>
        <View
          style={{
            flex: 0.75,
            flexDirection: "column"
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              //alignItems: "flex-start",
              flexDirection: "row"
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: Color.black,
                  fontSize: 16,
                  fontFamily: "Nunito-Bold"
                }}
              >
                {item.items.name}
              </Text>
              <Text
                style={{
                  color: Color.secondary,
                  fontFamily: "Nunito-Bold",
                  marginRight: 10,
                  marginBottom: 10
                }}
              >
                Rs. {Number(item.items.price).toFixed(2)}
              </Text>
            </View>

            <View
              style={{
                justifyContent: "flex-start"
              }}
            >
              <Icon
                style={{ padding: 4 }}
                name="ios-close"
                size={30}
                color={Color.black}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
              // backgroundColor: "red"
            }}
          >
            <Text
              style={{
                color: Color.black,
                fontSize: 14,
                fontFamily: "Nunito-Regular"
              }}
            >
              Made by:
              <Text
                style={{
                  color: Color.gray,
                  fontSize: 14,
                  fontFamily: "Nunito-Regular"
                }}
              >
                {` ${item.items.owner.full_name}`}
              </Text>
            </Text>

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: Color.gray,
                  fontSize: 20,
                  fontFamily: "Nunito-Regular",
                  paddingHorizontal: 10
                }}
              >
                -
              </Text>

              <Text style={styles.regularText}>{item.quantity}</Text>

              <Text
                style={{
                  color: Color.gray,
                  fontSize: 20,
                  fontFamily: "Nunito-Regular",
                  paddingHorizontal: 10
                }}
              >
                +
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  renderSubTotal(cart_total) {
    var delivery = cart_total * 0.1;
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginLeft: width * 0.5
            // paddingBottom: 4
          }}
        >
          <Text
            style={{
              color: Color.gray,
              fontSize: 14,
              fontFamily: "Nunito-Bold"
            }}
          >
            Sub Total
          </Text>
          <Text
            style={{
              color: Color.gray,
              fontSize: 14,
              fontFamily: "Nunito-Bold"
            }}
          >
            {`Rs. ${cart_total}`}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginLeft: width * 0.5,
            paddingVertical: 4
          }}
        >
          <Text
            style={{
              color: Color.gray,
              fontSize: 14,
              fontFamily: "Nunito-Bold"
            }}
          >
            Delivery
          </Text>
          <Text
            style={{
              color: Color.gray,
              fontSize: 14,
              fontFamily: "Nunito-Bold"
            }}
          >
            {`Rs. ${delivery}`}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginLeft: width * 0.5,
            paddingVertical: 4
          }}
        >
          <Text
            style={{
              color: Color.black,
              fontSize: 18,
              fontFamily: "Nunito-Black"
            }}
          >
            Total
          </Text>
          <Text
            style={{
              color: Color.black,
              fontSize: 18,
              fontFamily: "Nunito-Black"
            }}
          >
            {`Rs. ${cart_total + delivery}`}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    if (this.state.cart.length > 0) {
      const { cart } = this.state;
      var cart_total = 0;
      cart.map(item => {
        cart_total =
          cart_total + Number(item.items.price) * Number(item.quantity);
        console.log(cart_total);
      });
      return (
        <View style={styles.container}>
          {this.renderHeader()}
          {this.renderCartItem()}
          {this.renderSubTotal(cart_total)}
          <View style={styles.buttonContainer}>
            <CustomButton
              buttonText={"PROCEED TO CHECKOUT"}
              onButtonPress={() =>
                this.props.onOrderScreenPress(this.state.cart)
              }
            />
          </View>
          <LoadingSpinnerOverlay
            ref={component => (this._modal_2_LoadingSpinnerOverLay = component)}
          >
            {this._renderActivityIndicator()}
          </LoadingSpinnerOverlay>
        </View>
        // <EmptyCart onEmptyCartPress={this.props.onHomeScreenPress} />
      );
    } else {
      return <EmptyCart onEmptyCartPress={this.props.onHomeScreenPress} />;
    }
  }
}
export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfcfc"
  },
  header: {
    padding: 20
  },
  title: {
    fontSize: 24,
    color: Color.black,
    fontFamily: "Nunito-Black",
    paddingHorizontal: 10,
    marginTop: Platform.OS === "ios" ? 14 : 0
  },
  searchSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFF",
    margin: 32,
    borderRadius: 22
  },
  searchIcon: {
    paddingBottom: 10
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#F9FAFF",
    color: Color.gray,
    backgroundColor: "#F9FAFF",
    fontFamily: "Nunito-Regular",
    borderRadius: 22
  },
  recentSearchText: {
    color: Color.black,
    fontFamily: "Nunito-Bold",
    paddingHorizontal: 34,
    paddingBottom: 10,
    fontSize: 20
  },
  recentText: {
    color: Color.gray,
    fontFamily: "Nunito-Regular",
    paddingHorizontal: 34,
    paddingBottom: 10,
    fontSize: 16
  },
  recommendContainer: { flex: 1, flexDirection: "column", paddingTop: 7 },
  recommendedHeader: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 36,
    paddingVertical: 20,
    flexDirection: "row"
  },
  recommendText: {
    fontSize: 14 * 1.4,
    color: Color.black,
    fontFamily: "Nunito-Black"
  },
  viewAllText: { color: Color.gray2, fontFamily: "Nunito-Regular" },
  shadow: {
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  searchIcon: {
    padding: 12
  },
  buttonContainer: {
    paddingHorizontal: 32,
    justifyContent: "center",
    paddingBottom: 20
  },
  regularText: {
    color: Color.black,
    fontSize: 18,
    fontFamily: "Nunito-Black",
    alignSelf: "center"
  }
});
