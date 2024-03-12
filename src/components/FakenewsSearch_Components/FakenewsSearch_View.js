import React, { useEffect, useState } from "react";
import { Badge, Card, Descriptions, Divider,Image } from "antd";
import { Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import moment from "moment";

const FakenewsSearch_View = () => {
  const [fnInfo, setFnInfo] = useState([]);
  const [fakeNewsInfo, setFakeNewsInfo] = useState(null);
  const { id } = useParams();
  const [province, setProvince] = useState([]);
  const [selectOptions_med, setSelectOptions_med] = useState([]);
  const [selectOptions_fm, setSelectOptions_fm] = useState([]);
  const [selectOptions_dis_c, setSelectOptions_dis_c] = useState([]);
  const [selectOptions_che, setSelectOptions_che] = useState([]);
  const [selectOptions_ty, setSelectOptions_ty] = useState([]);
  const [selectOptions_moti, setSelectOptions_moti] = useState([]);
  const [selectOptions_data, setSelectOptions_data] = useState([]);
  const [selectOptions_about, setSelectOptions_about] = useState([]);

  useEffect(() => {
    const fetchFakeNewsInfo = async () => {
      try {
        const response = await fetch(
          `https://checkkonproject-sub.com/api/Manage_Fake_Info_show/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setFakeNewsInfo(data);
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchFakeNewsInfo();
  }, [id]);

  useEffect(() => {
    const fetchFNInfo = async () => {
      if (fakeNewsInfo && fakeNewsInfo.mfi_fninfo) {
        try {
          const response = await fetch(
            `https://checkkonproject-sub.com/api/FakeNewsInfo_show/${fakeNewsInfo.mfi_fninfo}`
          );
          if (response.ok) {
            const data = await response.json();
            setFnInfo(data);
          } else {
            console.error(
              "Error fetching fake news info data:",
              response.statusText
            );
          }
        } catch (error) {
          console.error("Error fetching fake news info data:", error);
        }
      }
    };
    fetchFNInfo();
  }, [fakeNewsInfo]);

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const response = await fetch(
          "https://checkkonproject-sub.com/api/Province_request"
        );
        if (response.ok) {
          const pv = await response.json();
          const filteredIds = pv.filter(
            (item) => item.id === (fnInfo && fnInfo.fn_info_province)
          );
          setProvince(filteredIds);
        } else {
          console.error("Error fetching province data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching province data:", error);
      }
    };

    if (fnInfo && fnInfo.fn_info_province) {
      fetchProvince();
    }
  }, [fnInfo]);

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const response = await fetch(
          "https://checkkonproject-sub.com/api/Province_request"
        );
        if (response.ok) {
          const pv = await response.json();
          const filteredIds = pv.filter(
            (item) =>
              item.id === (fakeNewsInfo && fakeNewsInfo.fn_info_province)
          );
          setProvince(filteredIds);
        } else {
          console.error("Error fetching province data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching province data:", error);
      }
    };

    if (fakeNewsInfo && fakeNewsInfo.fn_info_province) {
      fetchProvince();
    }
  }, [fakeNewsInfo]);

  const fetchDataAndSetOptions = async (endpoint, stateSetter) => {
    try {
      const response = await fetch(
        `https://checkkonproject-sub.com/api/${endpoint}`
      );
      if (response.ok) {
        const typeCodes = await response.json();
        stateSetter(typeCodes);
      } else {
        console.error(`Error fetching codes:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error fetching codes:`, error);
    }
  };

  useEffect(() => {
    const requests = [
      { type: "MediaChannels_request", setter: setSelectOptions_med },
      { type: "FormatData_request", setter: setSelectOptions_fm },
      { type: "DetailsNotiChannels_request", setter: setSelectOptions_dis_c },
      { type: "TypeInformation_request", setter: setSelectOptions_ty },
      { type: "Motivation_request", setter: setSelectOptions_moti },
      { type: "DataCharacteristics_request", setter: setSelectOptions_data },
      { type: "MediaChannels_request", setter: setSelectOptions_med },
      { type: "CheckingData_request", setter: setSelectOptions_che },
      { type: "About_request", setter: setSelectOptions_about },
    ];

    const onChange = async (requestType, setOptionsFunction) => {
      await fetchDataAndSetOptions(requestType, setOptionsFunction);
    };

    const initializeOptions = async () => {
      for (const { type, setter } of requests) {
        await onChange(type, setter);
      }
    };

    initializeOptions();
  }, []);

  const renderOption = (options, idKey, valueKey, fakeNewsInfoKey) => {
    if (!options || !fakeNewsInfo?.[fakeNewsInfoKey]) {
      return null;
    }
    const source = options.find(
      (source) => source[idKey] === fakeNewsInfo?.[fakeNewsInfoKey]
    );
    return source && <span>{source[valueKey]}</span>;
  };
  const createTypography = (label, text, fontSize = "25px") => (
    <Typography variant="body1" sx={{ fontSize }}>
      {label}
    </Typography>
  );

  const items2 = [
    {
      key: "0",
      label: createTypography("จังหวัด"),
      children:
        fnInfo &&
        createTypography(
          province.length > 0 ? province[0].prov_name : "Loading..."
        ),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "1",
      label: createTypography("แหล่งที่มาของข้อมูล"),
      children:
        fakeNewsInfo &&
        createTypography(
          <span>
            {renderOption(selectOptions_med, "id", "med_c_name", "mfi_dis_c")}
          </span>
        ),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "2",
      label: createTypography("หน่วยงานที่เก็บข้อมูล"),
      children:
        fakeNewsInfo &&
        createTypography(<span>{fakeNewsInfo.mfi_agency}</span>),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "3",
      label: createTypography("หัวข้อข้อมูลผิดพลาด"),
      children:
        fakeNewsInfo &&
        createTypography(<span>{fakeNewsInfo.mfi_d_topic}</span>),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "4",
      label: createTypography("รูปแบบของข้อมูล"),
      children:
        fakeNewsInfo &&
        createTypography(
          <span>
            {renderOption(selectOptions_fm, "id", "fm_d_name", "mfi_fm_d")}
          </span>
        ),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "5",
      label: createTypography("ขอบเขตการเผยแพร่"),
      children:
        fakeNewsInfo &&
        createTypography(
          <span>
            {renderOption(
              selectOptions_dis_c,
              "id",
              "detail_name",
              "mfi_dis_c"
            )}
          </span>
        ),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "6",
      label: createTypography("ผู้เผยแพร่ข้อมูล"),
      children:
        fakeNewsInfo && createTypography(<span>{fakeNewsInfo.mfi_publ}</span>),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "7",
      label: createTypography("ประเภทของข้อมูล"),
      children:
        fakeNewsInfo &&
        createTypography(
          <span>
            {renderOption(
              selectOptions_ty,
              "id",
              "type_info_name",
              "mfi_ty_info"
            )}
          </span>
        ),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "8",
      label: createTypography("เป็นเนื้อหาเกี่ยวกับโควิด"),
      children:
        fakeNewsInfo &&
        createTypography(
          <span>{fakeNewsInfo.mfi_only_cv === 1 ? "ใช่" : "ไม่ใช่"}</span>
        ),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "9",
      label: createTypography("แรงจูงใจการเผยแพร่"),
      children:
        fakeNewsInfo &&
        createTypography(
          <span>
            {renderOption(selectOptions_moti, "id", "moti_name", "mfi_moti")}
          </span>
        ),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "10",
      label: createTypography("จำนวนการวนซ้ำ"),
      children:
        fakeNewsInfo &&
        createTypography(<span>{fakeNewsInfo.mfi_iteration}</span>),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "11",
      label: createTypography("การตรวจสอบข้อมูล"),
      children:
        fakeNewsInfo &&
        createTypography(
          <span>
            {renderOption(selectOptions_che, "id", "che_d_format", "mfi_che_d")}
          </span>
        ),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "12",
      label: createTypography("ลักษณะข้อมูล"),
      children:
        fakeNewsInfo &&
        createTypography(
          <span>
            {renderOption(
              selectOptions_data,
              "id",
              "data_cha_name",
              "mfi_data_cha"
            )}
          </span>
        ),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "13",
      label: createTypography("เพิ่มเมื่อ"),
      children:
        fakeNewsInfo &&
        createTypography(
          <span>
            {fakeNewsInfo.created_at &&
              moment(fakeNewsInfo.fn_info_dmy)
                .locale("th")
                .format("DD MMMM YYYY")}
          </span>
        ),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "14",
      label: "สถานะ",
      children: fakeNewsInfo && (
        <React.Fragment>
          <Badge
            status={
              fakeNewsInfo.fn_info_status === 0
                ? "warning"
                : fakeNewsInfo.fn_info_status === 1
                ? "processing"
                : "success"
            }
            text={
              fakeNewsInfo.fn_info_status === 0
                ? "รอตรวจสอบ"
                : fakeNewsInfo.fn_info_status === 1
                ? "กำลังตรวจสอบ"
                : "ตรวจสอบแล้ว"
            }
          />
        </React.Fragment>
      ),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "15",
      label: createTypography("ผลการตรวจสอบ"),
      children:
        fakeNewsInfo &&
        createTypography(
          fakeNewsInfo.mfi_results === 1 ? "ข่าวจริง" : "ข่าวเท็จ"
        ),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "16",
      label: createTypography("เกี่ยวกับ"),
      children:
        fakeNewsInfo &&
        createTypography(
          <span>
            {renderOption(
              selectOptions_about,
              "id",
              "about_name",
              "mfi_con_about"
            )}
          </span>
        ),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "17",
      label: createTypography("แท็ก"),
      children:
        fakeNewsInfo && createTypography(<span>{fakeNewsInfo.mfi_tag}</span>),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "18",
      label: createTypography("ภาพบันทึกหน้าจอหรือภาพถ่ายที่พบข้อมูลเท็จ"),
      children: (
        fnInfo &&
        (
          <>
            {[
              fnInfo.fn_info_image_0,
              fnInfo.fn_info_image_1,
              fnInfo.fn_info_image_2,
            ]
              .filter(image => image !== null)
              .map((image, index) => (
                <Image
                  key={`image_${index}`}
                  style={{ width: '200px', height: '200px', marginRight: '10px' }}
                  src={image}
                  alt={`รูปภาพข่าวปลอม ${index}`}
                />
              ))}
          </>
        )
      ),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
      span: 3,
    },
  ];

  return (
    <div className="backgroundColor">
      <Paper
        elevation={0}
        className="paperContainer"
        style={{ backgroundColor: "#e4e4e4" }}
      >
        <Card className="cardsection">
          <div className="cardsectionContent">รายละเอียดข้อมูลเท็จ</div>
        </Card>
        <br />
        <Card>
          <Typography variant="h3" gutterBottom sx={{ color: "#000000" }}>
            รายละเอียดจากการวิเคราะห์ข้อมูล
          </Typography>
          <Divider />
          <Descriptions layout="vertical" bordered items={items2} />
        </Card>
      </Paper>
    </div>
  );
};

export default FakenewsSearch_View;
