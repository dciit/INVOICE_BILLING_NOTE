import React, { useEffect, useState } from "react";
import { DatePicker, Button, Form, Divider, Table, Checkbox, type TableColumnsType } from "antd";
import { CheckCircleOutlined, FileDoneOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import service from "../../service/confirm.service";
import { useSelector } from "react-redux";
import "../../css/InvoiceConfirm.css";
import Swal from "sweetalert2";

export type MData = {
    no: number;
    key: React.Key;
    amount: string;
    venderName: string;
    documentDate: string;
    documentNo: string;
    netDueDate: string;
    paymentTerms: string;
    postingDate: string;
    reference: string;
    totalAmount: string;
    vat: string;
};

export default function InvoiceConfirmReport() {
    const auth = useSelector((state: any) => state.reducer.authen);
    const [fromDate, setFromDate] = useState<Dayjs | null>(null);
    const [toDate, setToDate] = useState<Dayjs | null>(null);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [vatFilter, setVatFilter] = useState<string[]>([]);
    const [checkAllCorrect, setCheckAllCorrect] = useState(false);
    const [checkSomeIncorrect, setCheckSomeIncorrect] = useState(false);
    const [dataView, setDataView] = useState<MData[]>([]);
    const visibleData = dataView.filter(item => vatFilter.length === 0 || vatFilter.includes(item.vat));
    const [loading, setLoading] = useState(false)



    // useEffect(() => {
    //     fetchData();
    // }, [auth.username]);

    // const fetchData = async () => {
    //     try {
    //         const res = await service.PostInvoiceReport({ venderCode: auth.username });
    //         const mappedData = res.data.map((item: any, index: number) => ({
    //             no: item.no,
    //             key: index,
    //             venderName: item.venderName,
    //             documentDate: item.documentDate,
    //             documentNo: item.documentNo,
    //             netDueDate: item.netDueDate,
    //             paymentTerms: item.paymentTerms,
    //             postingDate: item.postingDate,
    //             reference: item.reference,
    //             amount: item.amount,
    //             totalAmount: item.totalAmount,
    //             vat: item.vat,
    //         }));
    //         setDataView(mappedData);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };



    const toggleSelectAll = (checked: boolean) => {
        const keys = visibleData.map(item => item.key);
        setSelectedKeys(checked ? keys : []);
    };

    const onSearch = () => {
        if (!fromDate || !toDate) {
            Swal.fire({
                icon: 'warning',
                title: 'Please select Document dates.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
            return;
        }

        setLoading(true);


        service.PostInvoiceReport({ venderCode: auth.username }).then((res) => {
            try {
                const mappedData = res.data.map((item: any, index: number) => ({
                    no: item.no,
                    key: index,
                    venderName: item.venderName,
                    documentDate: item.documentDate,
                    documentNo: item.documentNo,
                    netDueDate: item.netDueDate,
                    paymentTerms: item.paymentTerms,
                    postingDate: item.postingDate,
                    reference: item.reference,
                    amount: item.amount,
                    totalAmount: item.totalAmount,
                    vat: item.vat,
                }));
                setDataView(mappedData);
            } catch (error) {
                console.error(error);
            }
        })
            .finally(() => {
                setLoading(false);
            });

        console.log("Search with date:", {
            from: fromDate.format("YYYY-MM-DD"),
            to: toDate.format("YYYY-MM-DD"),
        });
    };

    const onConfirm = () => {
        console.log("Confirm selected invoices:", selectedKeys);
        console.log("Checkbox status:", { checkAllCorrect, checkSomeIncorrect });
    };

    const columns: TableColumnsType<MData> = [
        { title: "No", dataIndex: "no", width: 60, align: "center" },
        {
            title: <div style={{ textAlign: "center" }}>Vender Name</div>,
            dataIndex: "venderName",
            width: 200,
            ellipsis: true
        },
        { title: "Reference", dataIndex: "reference", width: 120, align: "center" },
        { title: "Document No", dataIndex: "documentNo", width: 130, align: "center" },
        { title: "Payment Terms", dataIndex: "paymentTerms", width: 120, align: "center" },
        { title: "Document Date", dataIndex: "documentDate", width: 120, align: "center" },
        { title: "Posting Date", dataIndex: "postingDate", width: 120, align: "center" },
        { title: "Net Due Date", dataIndex: "netDueDate", width: 120, align: "center" },
        {
            title: <div style={{ textAlign: "center" }}>Amount</div>,
            dataIndex: "amount",
            width: 120,
            align: "right",
            render: (val: string) => Number(val).toLocaleString()
        },
        {
            title: <div style={{ textAlign: "center" }}>VAT</div>,
            dataIndex: "vat",
            width: 80,
            align: "right",
            filters: [
                { text: "7", value: "7" },
                { text: "0", value: "0" },
            ],
            filteredValue: vatFilter,
            onFilter: (value, record) => record.vat?.toString() === value,
            render: (value) => {
                const num = Number(value);
                return isNaN(num) ? value : num.toLocaleString();
            }
        },

        {
            title: <div style={{ textAlign: "center" }}>Total Amount</div>,
            dataIndex: "totalAmount",
            width: 140,
            align: "right",
            render: (val: string) => Number(val).toLocaleString()
        },

        {
            title: (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>Confirm</span>
                    <Checkbox
                        checked={selectedKeys.length === visibleData.length && visibleData.length > 0}
                        indeterminate={selectedKeys.length > 0 && selectedKeys.length < visibleData.length}
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                </div>
            ),
            dataIndex: "confirm",
            width: 70,
            align: "center",
            render: (_, record) => (
                <Checkbox
                    checked={selectedKeys.includes(record.key)}
                    onChange={(e) => {
                        if (e.target.checked) setSelectedKeys([...selectedKeys, record.key]);
                        else setSelectedKeys(selectedKeys.filter(k => k !== record.key));
                    }}
                />
            ),
        },
    ];

    const getGrandTotal = () => {
        return visibleData.reduce((sum, item) => {
            const amount = parseFloat(item.totalAmount || "0");
            return sum + amount;
        }, 0).toLocaleString();
    };


    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <FileDoneOutlined style={{ fontSize: 28, marginRight: 10, color: "#1890ff" }} />
                <p style={{ fontWeight: 600, fontSize: 20, margin: 0 }}>Confirm Invoice Report</p>
            </div>

            <Divider style={{ borderColor: "#d0cdcd", marginTop: 8 }} />

            <div style={{ display: "flex", justifyContent: "center", margin: "2px 0 20px 0" }}>
                <Form layout="inline" style={{ alignItems: "center" }}>
                    <span style={{ marginRight: 10, fontWeight: 500, fontSize: 16 }}>Document Date From :</span>

                    <Form.Item>
                        <DatePicker placeholder="From" format="YYYY-MM-DD" value={fromDate} onChange={setFromDate} style={{ height: 40 }} />
                    </Form.Item>

                    <span style={{ marginRight: 10, fontWeight: 500, fontSize: 16 }}>To :</span>

                    <Form.Item>
                        <DatePicker placeholder="To" format="YYYY-MM-DD" value={toDate} onChange={setToDate} style={{ height: 40 }} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={onSearch} loading={loading} style={{ height: 40, borderRadius: 6 }}>Search</Button>
                    </Form.Item>
                </Form>
            </div>

            <div style={{ maxHeight: 600, overflowY: 'auto' }} className="customTable">
                <Table
                    columns={columns}
                    dataSource={visibleData}
                    scroll={{ x: "max-content", y: 400 }}
                    sticky={{ offsetHeader: 0, offsetScroll: 0 }}
                    bordered
                    pagination={false}
                    loading={{
                        spinning: loading,
                        tip: "Loading...",
                        size: "large",
                    }}
                    summary={() => (
                        <Table.Summary fixed="bottom">
                            <Table.Summary.Row style={{ backgroundColor: "#fafafa", fontWeight: 700 }}>
                                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                                <Table.Summary.Cell index={3}></Table.Summary.Cell>
                                <Table.Summary.Cell index={4}></Table.Summary.Cell>
                                <Table.Summary.Cell index={5}></Table.Summary.Cell>
                                <Table.Summary.Cell index={6}></Table.Summary.Cell>
                                <Table.Summary.Cell index={7}></Table.Summary.Cell>
                                <Table.Summary.Cell index={8} colSpan={2} align="center">
                                    Grand Total
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={10} align="right">
                                    {getGrandTotal()}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={11}></Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </div>
        </div>
    );
}
