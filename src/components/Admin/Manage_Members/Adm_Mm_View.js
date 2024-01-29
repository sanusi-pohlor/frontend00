import React, { useEffect, useState } from "react";
import UserProfile from "./Profile_Menu";
import { Button, Modal, Descriptions } from "antd";
import RegisterDialog from "./Profile_Edit";
import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";

const Adm_Mm_View = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [province, setProvince] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [registerVisible, setRegisterVisible] = useState(false);

    const showModal = () => setIsModalOpen(true);
    const handleOk = () => {
        localStorage.removeItem("access_token");
        window.location.reload();
        console.log("Logged out successfully");
        setIsModalOpen(false);
    };
    const handleCancel = () => setIsModalOpen(false);

    const showRegisterDialog = () => setRegisterVisible(true);
    const closeRegisterDialog = () => setRegisterVisible(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get("email"),
            password: data.get("password"),
        });
    };

    const RegisterFinish = (values) => {
        console.log("Received values of form: ", values);
    };
    const fetchData = async () => {
        try {
            const response = await fetch(
                `https://checkkonproject-sub.com/api/AmUser/${id}`
            );
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                console.error("Error fetching data:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const fetchProvince = async () => {
            try {
                const response = await fetch(
                    "https://checkkonproject-sub.com/api/Province_request"
                );
                if (response.ok) {
                    const pv = await response.json();
                    const filteredIds = pv.filter(
                        (item) => item.id === (user && user.province)
                    );
                    setProvince(filteredIds);
                    console.log("Filtered provinces:", filteredIds);
                } else {
                    console.error("Error fetching province data:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching province data:", error);
            }
        };

        if (user && user.province) {
            fetchProvince();
        }
    }, [user]);

    const createTypography = (label, text, fontSize = "25px") => (
        <Typography variant="body1" sx={{ fontSize }}>{label}: {text}</Typography>
    );

    const items = [
        { key: "1", label: createTypography("ชื่อ-นามสกุล"), children: user && createTypography("ชื่อ-นามสกุล", user.username), style: { background: '#FFC0CB' } },
        { key: "2", label: createTypography("นามสกุล"), children: user && createTypography("นามสกุล", user.lastName), style: { background: '#FFD700' } },
        { key: "3", label: createTypography("จังหวัดที่อยู่"), children: province.length > 0 && createTypography("จังหวัดที่อยู่", province[0].prov_name), style: { background: '#98FB98' } },
        { key: "4", label: createTypography("อีเมล"), children: user && createTypography("อีเมล", user.email), style: { background: '#87CEFA' } },
        { key: "5", label: createTypography("เบอร์โทรศัพท์"), children: user && createTypography("เบอร์โทรศัพท์", user.phone_number), style: { background: '#FFA07A' } },
        { key: "6", label: createTypography("ไลน์ไอดี"), children: user && createTypography("ไลน์ไอดี", user.Id_line), style: { background: '#FFDAB9' } },
        { key: "7", label: createTypography("รับข้อมูลผ่านอีเมล"), children: user && createTypography("รับข้อมูลผ่านอีเมล", user.receive_ct_email), style: { background: '#DDA0DD' } },
    ];
    if (!user) {
        return (
            <UserProfile>
                <div>Loading...</div>
            </UserProfile>
        );
    }
    return (
        <UserProfile>
            <div
                className="userProfileContainer"
            >
                <Typography variant="body1" sx={{ fontSize: "45px" }}>ข้อมูลสมาชิก</Typography>
                <div className="buttonContainer">
                    <Button type="primary" target="_blank" onClick={showRegisterDialog}
                        className="buttonfilterStyle">
                        {createTypography("แก้ไขข้อมูลสมาชิก", "")}
                    </Button>
                    {registerVisible && (
                        <RegisterDialog
                            open={registerVisible}
                            onClose={closeRegisterDialog}
                            handleSubmit={handleSubmit}
                            RegisterFinish={RegisterFinish}
                        />
                    )}
                    <Button type="primary" target="_blank" onClick={showModal}
                        className="buttonfilterStyle">
                        {createTypography("ออกจากระบบ", "")}
                    </Button>
                    <Modal
                        visible={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        okText="ยืนยัน"
                        cancelText="ยกเลิก"
                    >
                        <p>{createTypography("ต้องการออกจากระบบ")}</p>
                    </Modal></div>
            </div>
            <br />
            <div>
                <Descriptions bordered items={items} />
            </div>
        </UserProfile>
    );
};

export default Adm_Mm_View;