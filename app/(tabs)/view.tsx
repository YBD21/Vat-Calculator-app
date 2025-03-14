import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";
import { useState, useEffect } from "react"; // Added useEffect
import useStore from "../../hooks/store/useStore";

const CalculateVatPage = () => {
  const [quantity, setQuantity] = useState("");
  const [selectedRate, setSelectedRate] = useState<"retail" | "depo">("retail");
  const [result, setResult] = useState<{
    perUnit: number;
    totalValue: number;
    tax: number;
    totalPayable: number;
  } | null>(null);

  const { retailRate, depoRate } = useStore();

  const RateButton = ({
    type,
    label,
  }: {
    type: "retail" | "depo";
    label: string;
  }) => (
    <TouchableOpacity
      onPress={() => setSelectedRate(type)}
      className={`flex-1 py-3 px-6 rounded-lg ${
        selectedRate === type
          ? "bg-black"
          : "bg-gray-100 border border-gray-200"
      }`}
    >
      <Text
        className={`text-center font-medium ${
          selectedRate === type ? "text-white" : "text-gray-900"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Auto calculate when quantity or selectedRate changes
  useEffect(() => {
    const qty = parseFloat(quantity) || 0;
    if (qty > 0) {
      const currentRate = selectedRate === "retail" ? retailRate : depoRate;
      const perUnit = currentRate / 1.13;
      const totalValue = perUnit * qty;
      const tax = ((currentRate * qty) / 1.13) * 0.13;
      const totalPayable = totalValue + tax;
      setResult({ perUnit, totalValue, tax, totalPayable });
    } else {
      setResult(null);
    }
  }, [quantity, selectedRate, retailRate, depoRate]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "VAT Calculator",
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "white",
        }}
      />

      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-6">
          <View className="mb-6">
            <Text className="text-sm font-semibold mb-2 text-gray-700">
              Quantity
            </Text>
            <TextInput
              className="w-full border border-gray-300 rounded-lg p-3 text-black"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="Enter quantity"
              placeholderTextColor="#666"
            />
          </View>
          <Text className="text-sm font-semibold mb-4 text-gray-700">
            Select Rate Type
          </Text>
          <View className="flex-row space-x-4 mb-6 gap-6">
            <RateButton type="retail" label="Retail Rate" />
            <RateButton type="depo" label="Depo Rate" />
          </View>

          {result && (
            <View className="mt-6 p-4 bg-white rounded-lg shadow border border-gray-200">
              <Text className="text-lg font-semibold text-black mb-4">
                Calculation Result
              </Text>
              <View className="space-y-3">
                <View className="flex-row justify-between py-2 border-b border-gray-200">
                  <Text className="text-gray-600 flex-1">
                    Per Unit (प्रति इकाई)
                  </Text>
                  <Text className="text-black font-medium">
                    {result.perUnit.toFixed(2)}
                  </Text>
                </View>

                <View className="flex-row justify-between py-2 border-b border-gray-200">
                  <Text className="text-gray-600 flex-1">
                    Total Value (जम्मा मूल्य)
                  </Text>
                  <Text className="text-black font-medium">
                    {result.totalValue.toFixed(2)}
                  </Text>
                </View>

                <View className="flex-row justify-between py-2 border-b border-gray-200">
                  <Text className="text-gray-600 flex-1">Total (जम्मा)</Text>
                  <Text className="text-black font-medium">
                    {result.totalValue.toFixed(2)}
                  </Text>
                </View>

                <View className="flex-row justify-between py-2 border-b border-gray-200">
                  <Text className="text-gray-600 flex-1">
                    Taxable Value (कर लाग्ने मूल्य)
                  </Text>
                  <Text className="text-black font-medium">
                    {result.totalValue.toFixed(2)}
                  </Text>
                </View>

                <View className="flex-row justify-between py-2 border-b border-gray-200">
                  <Text className="text-gray-600 flex-1">
                    13% Tax (१३% प्रतिशतले कर)
                  </Text>
                  <Text className="text-black font-medium">
                    {result.tax.toFixed(2)}
                  </Text>
                </View>

                <View className="flex-row justify-between py-2 bg-gray-50 rounded-md p-2">
                  <Text className="text-gray-800 font-semibold flex-1">
                    Total Payable (जम्मा तिर्नु पर्ने रकम)
                  </Text>
                  <Text className="text-black font-bold">
                    {result.totalPayable.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default CalculateVatPage;
