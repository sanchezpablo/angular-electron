import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ElectronService } from '../../../providers/electron.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    currentDate: string;
    appVersion: string;

  constructor(private translate: TranslateService, private electronService: ElectronService) {
      this.currentDate = moment().format('DD/MM/YYYY');
      this.appVersion = electronService.getApplicationVersion();
  }

  ngOnInit() {}
}
