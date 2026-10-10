import { Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  concatMap,
  map,
  of
} from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { environment } from '../../../../environments/environment';

import { Unit } from '../model/unit.model';
import { CreateUnitResource } from '../model/create-unit-resource.model';
import { UpdateUnitResource } from '../model/update-unit-resource.model';

@Injectable({
  providedIn: 'root'
})
export class UnitsService extends BaseService<Unit> {

  constructor() {
    super();
    this.resourceEndpoint = environment.unitEndpointPath;
  }

  createUnit(resource: CreateUnitResource): Observable<Unit> {
    return this.http.post<Unit>(
      this.resourcePath(),
      resource,
      this.httpOptions
    ).pipe(
      concatMap(createdUnit =>
        this.ensureIdUnit(createdUnit)
      ),
      catchError(this.handleError)
    );
  }

  /*
   * La fake API (json-server) solo genera el campo `id` al crear el
   * recurso, por lo que `idUnit` llega vacío. Como el resto de la app
   * (residentes, deudas, pagos) relaciona por `idUnit`, se completa con
   * una actualización usando el `id` generado.
   */
  private ensureIdUnit(
    createdUnit: Unit
  ): Observable<Unit> {
    const hasIdUnit =
      Number(createdUnit?.idUnit) > 0;

    const generatedId =
      Number(createdUnit?.id);

    if (hasIdUnit || !Number.isFinite(generatedId) ||
        generatedId <= 0) {
      return of(createdUnit);
    }

    const resource: UpdateUnitResource = {
      idBuilding: Number(createdUnit.idBuilding),
      unitNumber: Number(createdUnit.unitNumber),
      floor: Number(createdUnit.floor),
      coveredArea: Number(createdUnit.coveredArea),
      totalArea: Number(createdUnit.totalArea),
      participationPercentage:
        Number(createdUnit.participationPercentage),
      distributionPercentage:
        Number(createdUnit.distributionPercentage),
      status: String(createdUnit.status)
    };

    return this.http.put<Unit>(
      this.getUnitUrl(generatedId),
      resource,
      this.httpOptions
    ).pipe(
      map(updatedUnit => ({
        ...updatedUnit,
        idUnit:
          Number(updatedUnit.idUnit) > 0
            ? updatedUnit.idUnit
            : generatedId
      }))
    );
  }

  override update(
    idUnit: number,
    resource: UpdateUnitResource
  ): Observable<Unit> {
    return this.http.put<Unit>(
      this.getUnitUrl(idUnit),
      resource,
      this.httpOptions
    );
  }

  getUnitUrl(idUnit: number): string {
    return `${this.resourcePath()}/${idUnit}`;
  }

  getByBuildingId(idBuilding: number): Observable<Unit[]> {
    const baseUrl = this.serverBaseUrl.replace(/\/+$/, '');

    const buildingsPath =
      environment.buildingEndpointPath.replace(/^\/+/, '');

    return this.http.get<Unit[]>(
      `${baseUrl}/${buildingsPath}/${idBuilding}/units`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }
}
