import React, { useState, useEffect } from "react";
import { InputNumber, Card, Typography, Button, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const MyTax = () => {
  const [salary, setSalary] = useState(null);
  const [results, setResults] = useState({
    incomeEmploymentAnnual: 0,
    houseRentAllowanceAnnual: 0,
    medicalAllowanceAnnual: 0,
    conveyanceAllowanceAnnual: 0,
    festivalAllowanceAnnual: 0,
  });

  useEffect(() => {
    if (salary !== null && salary > 0) {
      const incomeEmploymentAnnual = 12 * 0.5 * salary;
      const houseRentAllowanceAnnual = 12 * 0.2 * salary;
      const medicalAllowanceAnnual = 12 * 0.1 * salary;
      const conveyanceAllowanceAnnual = 12 * 0.1 * salary;
      const festivalAllowanceAnnual = 12 * 0.1 * salary;

      setResults({
        incomeEmploymentAnnual,
        houseRentAllowanceAnnual,
        medicalAllowanceAnnual,
        conveyanceAllowanceAnnual,
        festivalAllowanceAnnual,
      });
    } else {
      setResults({
        incomeEmploymentAnnual: 0,
        houseRentAllowanceAnnual: 0,
        medicalAllowanceAnnual: 0,
        conveyanceAllowanceAnnual: 0,
        festivalAllowanceAnnual: 0,
      });
    }
  }, [salary]);

  const handleCopy = (text, label) => {
    // navigator.clipboard.writeText(text);
    // copy to clipboard
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);

    message.success(`${label} copied to clipboard`);
  };

  // Define card configurations with unique colors
  const cardConfigs = [
    {
      title: "Income from Employment (Annual)",
      value: results.incomeEmploymentAnnual,
      color: "bg-yellow-500",
    },
    {
      title: "House Rent Allowance (HRA) (Annual)",
      value: results.houseRentAllowanceAnnual,
      color: "bg-green-500",
    },
    {
      title: "Medical Allowance (Annual)",
      value: results.medicalAllowanceAnnual,
      color: "bg-yellow-500",
    },
    {
      title: "Conveyance Allowance (Annual)",
      value: results.conveyanceAllowanceAnnual,
      color: "bg-purple-500",
    },
    {
      title: "Festival Allowance (Annual)",
      value: results.festivalAllowanceAnnual,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-lg p-6">
        <Title level={3} className="text-center mb-6">
          Tax Calculator
        </Title>
        <div className="mb-6">
          <Text strong className="block mb-2">
            Enter Your Monthly Salary:
          </Text>
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            prefix="৳"
            parser={(value) => value.replace(/৳\s?|(,*)/g, "")}
            value={salary}
            onChange={(value) => setSalary(value)}
            placeholder="e.g., 5000"
          />
        </div>

        {salary !== null && salary > 0 && (
          <div>
            <Title level={4} className="mb-4 text-center">
              Annual Calculation Results:
            </Title>
            <div className="flex flex-col gap-4">
              {cardConfigs.map((card, index) => (
                <Card
                  key={index}
                  className={`flex justify-between items-center text-white ${card.color} p-4 rounded-lg shadow`}
                >
                  <div>
                    <Text strong>{card.title}</Text>
                    <Text className="block text-2xl font-bold">
                      ৳ {card.value.toFixed(0)}
                    </Text>
                  </div>
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={() =>
                      handleCopy(card.value.toFixed(0), card.title)
                    }
                    className="text-white"
                  />
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MyTax;
